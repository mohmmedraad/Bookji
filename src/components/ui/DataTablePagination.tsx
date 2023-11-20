import Link from "next/link"
import { type Table } from "@tanstack/react-table"
import { MoveLeft, MoveRight } from "lucide-react"

import { buttonVariants } from "@/components/ui/Button"

interface DataTablePaginationProps<TData> {
    table: Table<TData>
    url: string
    currentPage: number
}

export function DataTablePagination<TData>({
    url,
    currentPage,
}: DataTablePaginationProps<TData>) {
    const nextPage = currentPage + 1
    const previousPage = currentPage - 1 || 1
    return (
        <div>
            <div>
                <div className="flex items-center justify-between">
                    <Link
                        className={buttonVariants({ variant: "outline" })}
                        href={`${url}?_page=${previousPage}`}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <MoveLeft className="mr-2 h-4 w-4" />
                        Previous
                    </Link>
                    <Link
                        className={buttonVariants({ variant: "outline" })}
                        href={`${url}?_page=${nextPage}`}
                    >
                        <span className="sr-only">Go to next page</span>
                        Next
                        <MoveRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
