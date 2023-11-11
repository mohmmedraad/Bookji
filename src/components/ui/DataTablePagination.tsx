import Link from "next/link"
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
} from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { MoveLeft, MoveRight } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/Button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select"

interface DataTablePaginationProps<TData> {
    table: Table<TData>
    url: string
    currentPage: number
}

export function DataTablePagination<TData>({
    table,
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
