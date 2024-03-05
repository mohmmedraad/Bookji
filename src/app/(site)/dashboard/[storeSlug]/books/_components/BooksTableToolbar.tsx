"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/Button"
import { DataTableViewOptions } from "@/components/ui/DataTableViewOptions"
import SearchInput from "@/components/ui/SearchInput"
import AddBookDialog from "@/components/AddBookDialog"

import DashboardBooksFilter from "./BooksFilter"

interface BooksTableToolbarProps<TData> {
    table: Table<TData>
}

export function BooksTableToolbar<TData>({
    table,
}: BooksTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    return (
        <div className="items-center justify-between xs:flex">
            <div className="flex flex-1 items-center space-x-2">
                <SearchInput
                    param="text"
                    className="h-8 w-full xs:w-[150px] lg:w-[250px]"
                />
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="mt-4 flex items-center gap-4 xs:mt-0">
                <DataTableViewOptions table={table} />
                <AddBookDialog />
                <DashboardBooksFilter />
            </div>
        </div>
    )
}
