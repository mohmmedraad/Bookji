import type { Dispatch, SetStateAction } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { handleGenericError } from "@/lib/utils"
import { trpc } from "@/app/_trpc/client"

type SetOpen = Dispatch<SetStateAction<boolean>>
type OnSuccess = () => void

export const useCreateStore = (setOpen: SetOpen, onSuccess: OnSuccess) => {
    const router = useRouter()
    const { mutate: createStore, isLoading } = trpc.store.create.useMutation({
        onError: (error) => {
            if (error.data?.code === "UNAUTHORIZED") {
                router.push("/login?origin=/dashboard/store/")
                return toast.error("You must be logged in to create a store")
            }

            return handleGenericError()
        },
        onSuccess: () => {
            router.refresh()
            setOpen(false)
            onSuccess()
            return toast.success("Store created successfully")
        },
    })

    return { createStore, isLoading }
}
