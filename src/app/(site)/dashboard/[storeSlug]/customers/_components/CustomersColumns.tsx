"use client"

import { type Customer } from "@/types"
import { type ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader"

export const Columns: ColumnDef<Customer>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="id" id="book" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[50px] items-center">
                    <span className="text-gray-800">{row.getValue("id")}</span>
                </div>
            )
        },

        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[100px] items-center">
                    <span className="text-gray-800">
                        {row.getValue("email")}
                    </span>
                </div>
            )
        },
        filterFn: (row, id, value: string) => {
            return row.original.email
                .toLowerCase()
                .includes(value.toLowerCase())
        },
    },
    {
        accessorKey: "place",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Order Placed" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[100px] items-center">
                    <span>{row.getValue("place")}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "totalSpend",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Total Spend" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[100px] items-center">
                    <span className="text-gray-800">
                        100$
                        {/* {row.getValue("totalSpend")} */}
                    </span>
                </div>
            )
        },
    },
]
