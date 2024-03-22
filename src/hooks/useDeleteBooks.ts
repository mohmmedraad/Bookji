import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { BookColumn } from "@/types"
import { type Row } from "@tanstack/react-table"
import { toast } from "sonner"

import { trpc } from "@/app/_trpc/client"

export const useDeleteBooks = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const trpcUtils = trpc.useUtils()
    const [open, setOpen] = useState(false)

    const { mutate: deleteBooks, isLoading } = trpc.books.delete.useMutation({
        onSuccess: async () => {
            toast.success("Your books has been updated successfully.")
            await trpcUtils.store.books.invalidate()
            setOpen(false)
        },
        onError: (error) => {
            const errorCode = error?.data?.code
            if (errorCode === "UNAUTHORIZED") {
                toast.error(
                    "Your are not logged in, please login and try again"
                )
                return router.push(
                    `/sign-in?_origin=${searchParams.toString()}`
                )
            }
        },
    })

    function handleDeleteBooks(
        selectedRows: Row<BookColumn>[],
        currentRow: Row<BookColumn>
    ) {
        const selectedBooks = selectedRows.map((row) => row.original.id)

        const isCurrentRowSelected = selectedBooks.some(
            (SelectedRowId) => SelectedRowId === currentRow.original.id
        )
        if (!isCurrentRowSelected) {
            selectedBooks.push(currentRow.original.id)
        }

        deleteBooks({ booksIds: selectedBooks })
    }

    return {
        handleDeleteBooks,
        isLoading,
        open,
        setOpen,
    }
}
