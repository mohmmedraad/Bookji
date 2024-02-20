"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/Button"
import DataTableToolbarSearchInput from "@/components/ui/DataTableToolbarSearchInput"
// import { DataTableFacetedFilter } from "@/components/ui/DataTableFacetedFilter"
import { DataTableViewOptions } from "@/components/ui/DataTableViewOptions"
import AddBookDialog from "@/components/AddBookDialog"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export function DataTableToolbar<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <DataTableToolbarSearchInput defaultValue="" />
                {/* {table.getColumn("rating") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("rating")}
                        title="rating"
                        options={statuses}
                    />
                )} */}
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
                <AddBookDialog />
            </div>
        </div>
    )
}
