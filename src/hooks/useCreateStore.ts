import type { Dispatch, SetStateAction } from "react"
import { useRouter } from "next/navigation"
import { type UseFormReturn } from "react-hook-form"
import { toast } from "sonner"

import { handleGenericError } from "@/lib/utils"
import { trpc } from "@/app/_trpc/client"

type SetOpen = Dispatch<SetStateAction<boolean>>
type Form = UseFormReturn<
    {
        name: string
        description: string
        logo: string
        thumbnail: string
    },
    unknown,
    undefined
>

export const useCreateStore = (setOpen: SetOpen, form: Form) => {
    const router = useRouter()
    const { mutate: createStore, isLoading } = trpc.store.create.useMutation({
        onError: (error) => {
            if (error.data?.code === "UNAUTHORIZED") {
                router.push("/sign-in?_origin=/dashboard/")
                return toast.error("You must be logged in to create a store")
            }

            if (error.data?.code === "CONFLICT") {
                form.setError("name", {
                    message: "This store name is already taken",
                })
                return
            }

            if (error.data?.code === "BAD_REQUEST")
                return toast.error("Invalid data, please check your inputs")

            return handleGenericError()
        },
        onSuccess: () => {
            router.refresh()
            setOpen(false)
            form.reset()
            return toast.success("Store created successfully")
        },
    })

    return { createStore, isLoading }
}
