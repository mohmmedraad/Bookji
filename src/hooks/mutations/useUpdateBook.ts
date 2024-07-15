import { useRouter, useSearchParams } from "next/navigation"
import { useBookForm } from "@/store/useBookForm"
import { useStore } from "@/store/useStore"
import { toast } from "sonner"

import { handleGenericError } from "@/lib/utils"
import { type BookFormSchema } from "@/lib/validations/book"
import { useBookCategories } from "@/hooks/queries/useBookCategories"
import { trpc } from "@/app/_trpc/client"

export const useUpdateBook = ({
    id: bookId,
    ...book
}: Omit<BookFormSchema, "categories"> & { id: number }) => {
    const router = useRouter()
    const form = useBookForm((store) => store.form)
    const storeSlug = useStore((store) => store.slug)
    const SearchParams = useSearchParams()
    const trpcUtils = trpc.useUtils()

    const { data: categories, isLoading: isCategoriesLoading } =
        useBookCategories({ bookId })

    const { mutate: updateBook, isLoading } = trpc.books.update.useMutation({
        onSuccess: async () => {
            await trpcUtils.store.books.invalidate()
            toast.success("Book updated successfully")
        },

        onError: (error) => {
            const errorCode = error?.data?.code
            if (errorCode === "UNAUTHORIZED") {
                toast.error("You must be logged in to update a book")
                return router.push(
                    `/sign-in?_origin=/dashboard/${storeSlug}/books?${SearchParams.toString()}`
                )
            }

            if (errorCode === "CONFLICT") {
                return form?.setError("title", {
                    type: "manual",
                    message: "Book with this title already exists",
                })
            }

            return handleGenericError()
        },
    })

    function onSubmit(data: BookFormSchema) {
        if (categories === undefined) return

        const updatedValues = getBookUpdatedValues(
            { ...book, categories },
            data
        )

        console.log("updatedValues: ", updatedValues)

        if (updatedValues === undefined) return

        updateBook({
            bookId,
            ...updatedValues,
        })
    }

    return {
        isCategoriesLoading,
        categories,
        isLoading,
        onSubmit,
    }
}

function getBookUpdatedValues(
    oldData: BookFormSchema,
    newData: BookFormSchema
) {
    const updatedValues = new Map<
        string,
        string | number | BookFormSchema["categories"]
    >()

    for (const [key, value] of Object.entries(oldData)) {
        console.log("key: ", key)
        if (
            key === "categories" &&
            !isSameCategories(oldData.categories, newData.categories)
        ) {
            updatedValues.set(key, newData.categories)
        }

        if (
            value !== newData[key as keyof typeof newData] &&
            key !== "categories"
        ) {
            updatedValues.set(key, newData[key as keyof typeof newData])
        }
    }

    if (updatedValues.size === 0) {
        return
    }

    return Object.fromEntries(updatedValues)
}

function isSameCategories(
    oldCategories: BookFormSchema["categories"],
    newCategories: BookFormSchema["categories"]
) {
    // if (oldCategories.length === newCategories.length) {
    //     return true
    // }

    const newCategoriesIds = new Map<number, boolean>()
    for (const category of newCategories) {
        newCategoriesIds.set(category.id, true)
    }

    for (const category of oldCategories) {
        if (!newCategoriesIds.has(category.id)) {
            return false
        }
    }

    return oldCategories.length === newCategories.length
}
