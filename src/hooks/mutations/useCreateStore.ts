import type { Dispatch, SetStateAction } from "react"
import { useRouter } from "next/navigation"
import type { TRPCErrorCause } from "@/types"
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
            const errorCode = error.data?.code
            const errorMessage = error.message as TRPCErrorCause

            if (errorCode === "UNAUTHORIZED") {
                router.push("/sign-in?_origin=/dashboard/")
                return toast.error("You must be logged in to create a store")
            }

            if (errorCode === "CONFLICT") {
                form.setError("name", {
                    message: "This store name is already taken",
                })
                return
            }

            const isForbidden = errorCode === "FORBIDDEN"

            if (isForbidden && errorMessage === "no_subscription") {
                return toast.error(
                    "You need to subscribe to a plan to create a store",
                    {
                        action: {
                            label: "Subscribe",
                            onClick: () => router.push("/dashboard/billing"),
                        },
                    }
                )
            }

            if (isForbidden && errorMessage === "stores_limit_reached") {
                return toast.error(
                    "You have reached the limit of stores you can create. Please upgrade your plan to create more stores.",
                    {
                        action: {
                            label: "Upgrade",
                            onClick: () => router.push("/dashboard/billing"),
                        },
                    }
                )
            }

            if (errorCode === "BAD_REQUEST")
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
