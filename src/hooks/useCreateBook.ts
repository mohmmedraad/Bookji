import { type Dispatch, type SetStateAction } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { handleGenericError } from "@/lib/utils"
import { type BookFormSchema } from "@/lib/validations/book"
import { trpc } from "@/app/_trpc/client"

import { useBookForm } from "./useBookForm"
import { useStore } from "./useStore"

type SetOpen = Dispatch<SetStateAction<boolean>>

export const useCreateBook = (setOpen: SetOpen) => {
    const router = useRouter()
    const form = useBookForm((store) => store.form)
    const storeId = useStore((store) => store.id)

    const { mutate, isLoading } = trpc.addBook.useMutation({
        onError: (error) => {
            const errorCode = error.data?.code
            if (errorCode === "UNAUTHORIZED") {
                router.push("/login?origin=/dashboard/store/")
                return toast.error("You must be logged in to add a book")
            }

            if (errorCode === "CONFLICT") {
                form?.setError("title", {
                    message: "Book with same title already exists",
                })
                return
            }

            if (errorCode === "BAD_REQUEST")
                return toast.error("Invalid data, please check your inputs")

            return handleGenericError()
        },
        onSuccess: () => {
            setOpen(false)

            router.refresh()

            return toast.success("Book added successfully")
        },
    })

    function createBook(data: BookFormSchema) {
        mutate({ storeId, ...data })
    }

    return { createBook, isLoading }
}
