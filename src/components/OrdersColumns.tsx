"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Star } from "lucide-react"

import { cn } from "@/lib/utils"
import { type OrderType } from "@/lib/validations/order"
import BookCover from "@/components/ui/BookCover"

import { Badge } from "./ui/Badge"
import { DataTableColumnHeader } from "./ui/DataTableColumnHeader"
import { UserAvatar } from "./UserAvatar"

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
                    <UserAvatar
                        user={{
                            firstName: "hello",
                            lastName: "world",
                            imageUrl: row.original.customerAvatar,
                        }}
                    />
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
                        className={cn({
                            "bg-green-100 text-green-800":
                                row.original.status === "delivered",
                            "bg-yellow-100 text-yellow-800":
                                row.original.status === "onWay",
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
        enableHiding: false,
    },
    {
        accessorKey: "categories",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Categories" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium text-gray-800">
                        {row.getValue("categories")}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "rating",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Rating" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[50px] items-center gap-3">
                    <Star
                        className="fill-primary text-primary"
                        width={16}
                        height={16}
                    />
                    <span className="text-sm font-bold text-primary">
                        {row.getValue("rating")}
                        <span className="text-gray-300">/5</span>
                    </span>
                </div>
            )
        },
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
