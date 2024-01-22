import type { Dispatch, SetStateAction } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { handleGenericError } from "@/lib/utils"
import { trpc } from "@/app/_trpc/client"

type SetOpen = Dispatch<SetStateAction<boolean>>
type OnSuccess = () => void

export const useCreateBook = (setOpen: SetOpen, onSuccess?: OnSuccess) => {
    const router = useRouter()
    const { mutate: createBook, isLoading } = trpc.addBook.useMutation({
        onError: (error) => {
            if (error.data?.code === "UNAUTHORIZED") {
                router.push("/login?origin=/dashboard/store/")
                return toast.error("You must be logged in to create a store")
            }

            if (error.data?.code === "BAD_REQUEST")
                return toast.error("Invalid data, please check your inputs")

            return handleGenericError()
        },
        onSuccess: () => {
            setOpen(false)

            if (onSuccess) onSuccess()

            return toast.success("Store created successfully")
        },
    })

    return { createBook, isLoading }
}
