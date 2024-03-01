import { type Table } from "@tanstack/react-table"
import { MoveLeft, MoveRight } from "lucide-react"
import { useQueryState } from "nuqs"

import { cn } from "@/lib/utils"

import { Button } from "./Button"

interface DataTablePaginationProps<TData> {
    table: Table<TData>
}

export function DataTablePagination<
    TData,
>({}: DataTablePaginationProps<TData>) {
    const [pageParam, setPageParam] = useQueryState("page")
    const currentPage =
        isNaN(Number(pageParam)) || pageParam === null ? 1 : +pageParam
    const nextPage = currentPage + 1
    const previousPage = currentPage - 1
    const isPreviousPageDisabled = previousPage === 0

    return (
        <div>
            <div>
                <div className="flex items-center justify-between">
                    <Button
                        className={cn({
                            "pointer-events-none opacity-50":
                                isPreviousPageDisabled,
                        })}
                        variant={"outline"}
                        disabled={isPreviousPageDisabled}
                        onClick={() =>
                            void setPageParam(previousPage.toString())
                        }
                    >
                        <span className="sr-only">Go to previous page</span>
                        <MoveLeft className="mr-2 h-4 w-4" />
                        <span className="hidden xs:block">Previous</span>
                    </Button>
                    <Button
                        // className={}
                        variant={"outline"}
                        onClick={() => void setPageParam(nextPage.toString())}
                    >
                        <span className="sr-only">Go to next page</span>
                        <span className="hidden xs:block">Next</span>

                        <MoveRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
