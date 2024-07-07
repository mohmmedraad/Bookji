"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { DataTableViewOptions } from "@/components/ui/data-table-view-options"
import SearchInput from "@/components/ui/search-input"

import OrdersFilter from "./OrdersFilter"

interface OrdersDataTableToolbarProps<TData> {
    table: Table<TData>
}

export function OrdersDataTableToolbar<TData>({
    table,
}: OrdersDataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <SearchInput
                    param="text"
                    className="h-8 w-[150px] lg:w-[250px]"
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
            <div className="flex items-center gap-4">
                <DataTableViewOptions table={table} />
                <OrdersFilter />
            </div>
        </div>
    )
}
