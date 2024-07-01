"use client"

import { type CustomerColumn } from "@/types"
import { type ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
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
                <div className="flex w-[150px] items-center ">
                    <span className="w-full overflow-x-hidden text-ellipsis text-gray-800">
                        {row.original.customer?.email}
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
        accessorKey: "totalOrders",
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Total Orders"
                sortByKey="totalOrders"
            />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[100px] items-center">
                    <span className="text-gray-800">
                        {row.getValue("totalOrders")}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "totalSpend",
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Total Spend"
                sortByKey="totalSpend"
            />
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
