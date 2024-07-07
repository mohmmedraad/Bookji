"use client"

import { useState } from "react"
import { type Table } from "@tanstack/react-table"

import { DataTableViewOptions } from "@/components/ui/data-table-view-options"
import SearchInput from "@/components/ui/search-input"
import AddBookDialog from "@/components/AddBookDialog"
import MobileSearchBar from "@/components/MobileSearchBar"

import DashboardBooksFilter from "./BooksFilter"

interface BooksTableToolbarProps<TData> {
    table: Table<TData>
}

export function BooksTableToolbar<TData>({
    table,
}: BooksTableToolbarProps<TData>) {
    const [isClosed, setIsClosed] = useState(true)

    return (
        <div className="flex items-center justify-between gap-4">
            <div className="flex flex-1 items-center space-x-2">
                <SearchInput
                    param="text"
                    className="hidden h-8 w-full xs:w-[150px] sm:block lg:w-[250px]"
                />
                <MobileSearchBar
                    className="flex sm:hidden"
                    param="text"
                    isClosed={isClosed}
                    isFocused={() => setIsClosed(false)}
                    isBlurred={() => setIsClosed(true)}
                />
            </div>
            {isClosed ? (
                <div className="flex items-center gap-4">
                    <DataTableViewOptions table={table} />
                    <AddBookDialog />
                    <DashboardBooksFilter />
                </div>
            ) : null}
        </div>
    )
}
