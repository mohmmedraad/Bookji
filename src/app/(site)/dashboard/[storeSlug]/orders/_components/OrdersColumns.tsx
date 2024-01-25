"use client"

import { type ColumnDef } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { type OrderType } from "@/lib/validations/order"
import { Badge } from "@/components/ui/Badge"
import BookCover from "@/components/ui/BookCover"
import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader"

export const Columns: ColumnDef<OrderType>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Books" id="book" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[250px] items-center gap-3">
                    <BookCover
                        src={row.original.cover}
                        alt={`The Secret Story cover`}
                        width={40}
                        height={56}
                        className="h-14 w-10"
                    />
                    <p>{row.original.title}</p>
                </div>
            )
        },
        filterFn: (row, id, value: string) => {
            return row.original.title
                .toLowerCase()
                .includes(value.toLowerCase())
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "customer",
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Customers"
                id="customer"
            />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[150px] items-center gap-3">
                    <p>{row.original.customerName}</p>
                </div>
            )
        },
        filterFn: (row, id, value: string) => {
            return row.original.customerName
                .toLowerCase()
                .includes(value.toLowerCase())
        },
        sortingFn: (rowA, rowB) => {
            return rowA.original.customerName.localeCompare(
                rowB.original.customerName
            )
        },
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" id="status" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[150px] items-center gap-3">
                    <Badge
                        // eslint-disable-next-line tailwindcss/migration-from-tailwind-2
                        className={cn("hover:bg-opacity-50", {
                            "bg-green-100 text-green-800":
                                row.original.status === "delivered",
                            "bg-yellow-100 text-yellow-800":
                                row.original.status === "on way",
                            "bg-red-100 text-red-800":
                                row.original.status === "canceled",
                        })}
                    >
                        {row.original.status}
                    </Badge>
                </div>
            )
        },
        sortingFn: (rowA, rowB) => {
            return rowA.original.status.localeCompare(rowB.original.status)
        },
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "price",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Price" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[50px] items-center">
                    <span>{row.getValue("price")}$</span>
                </div>
            )
        },
    },
]
