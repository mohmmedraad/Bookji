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
    const storeSlug = useStore((store) => store.slug)
    const trpcUtils = trpc.useUtils()

    const { mutate, isLoading } = trpc.books.add.useMutation({
        onSuccess: async () => {
            await trpcUtils.store.books.invalidate()
            toast.success("Book added successfully")
            return setOpen(false)
        },
        onError: (error) => {
            const errorCode = error.data?.code
            if (errorCode === "UNAUTHORIZED") {
                router.push(`/sign-in?_origin=/dashboard/${storeSlug}`)
                return toast.error("You must be logged in to add a book")
            }

            if (errorCode === "NOT_FOUND") {
                router.push(`/sign-in?_origin=/dashboard`)
                return toast.error("Store not found")
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
    })

    function createBook(data: BookFormSchema) {
        mutate({ storeId, ...data })
    }

    return { createBook, isLoading }
}
