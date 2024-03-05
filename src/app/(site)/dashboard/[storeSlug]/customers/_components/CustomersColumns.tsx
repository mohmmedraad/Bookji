"use client"

import { type CustomerColumn } from "@/types"
import { type ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader"
import { UserAvatar } from "@/components/UserAvatar"

export const Columns: ColumnDef<CustomerColumn>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" id="book" />
        ),
        cell: ({
            row: {
                original: { customer },
            },
        }) => {
            return (
                <div className="flex w-[200px] items-center gap-3">
                    <div className="flex w-[200px] items-center gap-3">
                        <UserAvatar
                            user={customer!}
                            className="h-7 w-7 shadow-md"
                        />
                        <span>
                            {customer?.firstName} {customer?.lastName}
                        </span>
                    </div>
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
        enableSorting: false,
    },
    // {
    //     accessorKey: "place",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Order Placed" />
    //     ),
    //     cell: ({ row }) => {
    //         return (
    //             <div className="flex w-[100px] items-center">
    //                 <span>{row.getValue("place")}</span>
    //             </div>
    //         )
    //     },
    // },
    {
        accessorKey: "orders",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Total Orders" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[100px] items-center">
                    <span className="text-gray-800">
                        {row.getValue("orders")}
                    </span>
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
                        {row.getValue("totalSpend")}
                    </span>
                </div>
            )
        },
    },
]
