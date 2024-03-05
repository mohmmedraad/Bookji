"use client"

import { useEffect, useState, type FC } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { type BookColumn } from "@/types"
import { toast } from "sonner"

import { useBooksSearchParams } from "@/hooks/useBooksSearchParams"
import { useStore } from "@/hooks/useStore"
import { DataTable } from "@/components/ui/DataTable"
import { trpc } from "@/app/_trpc/client"

import { BooksTableToolbar } from "../../books/_components/BooksTableToolbar"
import { Columns } from "../../books/_components/StoreBooksColumns"

interface BooksTableProps {
    initialBooks: BookColumn[]
}

const BooksTable: FC<BooksTableProps> = ({ initialBooks }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { handleClearSearch, ...searchParams } = useBooksSearchParams()
    const { id: storeId, slug: storeSlug } = useStore()
    const router = useRouter()
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const redirectSearchParams = useSearchParams()

    const {
        data: books,
        isFetching,
        isFetchedAfterMount,
    } = trpc.store.books.useQuery(
        {
            storeId,
            searchParams,
        },
        {
            skip: true,
            // @ts-expect-error unknown error
            initialData: initialBooks,
            onError: (error) => {
                const errorCode = error?.data?.code
                if (errorCode === "UNAUTHORIZED") {
                    toast.error(
                        "You are not authorized to view this store's books"
                    )
                    return router.push(
                        `/sign-in?_origin=/dashboard/${storeSlug}/books?${redirectSearchParams.toString()}`
                    )
                }
                if (errorCode === "NOT_FOUND") {
                    toast.error("Store not found")
                    return router.push("/dashboard")
                }
            },
        }
    )

    useEffect(() => {
        if (!isFetchedAfterMount) return
        setIsInitialLoading(false)
    }, [isFetchedAfterMount])

    return (
        <DataTable
            columns={Columns}
            // @ts-expect-error unknown error
            data={books}
            isFetching={isFetching}
            isInitialLoading={isInitialLoading}
            CustomDataTableToolbar={BooksTableToolbar}
        />
    )
}

export default BooksTable
