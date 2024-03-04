"use client"

import { type OrderColumn } from "@/types"
import { type ColumnDef } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/Badge"
import Book from "@/components/ui/BookCover"
import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader"
import { UserAvatar } from "@/components/UserAvatar"

export const Columns: ColumnDef<OrderColumn>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Title" id="title" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[120px] items-center">
                    <span>{row.getValue("title")}</span>
                </div>
            )
        },
        enableSorting: false,
        enableHiding: true,
    },
    {
        accessorKey: "customer",
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Customer"
                id="customer"
            />
        ),
        cell: ({
            row: {
                original: { customer },
            },
        }) => {
            return (
                <div className="flex w-[200px] items-center gap-3">
                    <UserAvatar
                        user={customer!}
                        className="h-7 w-7 shadow-md"
                    />
                    <span>
                        {customer?.firstName} {customer?.lastName}
                    </span>
                </div>
            )
        },
        enableSorting: false,
        enableHiding: true,
    },
    {
        accessorKey: "items",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Items" id="items" />
        ),
        cell: ({ row }) => {
            return (
                <div className="grid w-[150px] grid-cols-3 gap-2">
                    {row.original?.items?.map((item) => (
                        <Book
                            alt={"order items"}
                            key={item.cover}
                            src={item.cover}
                            width={50}
                            height={67}
                            className="aspect-[2/3]"
                        />
                    ))}
                </div>
            )
        },
    },
    {
        accessorKey: "total",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Total" id="total" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[100px] items-center">
                    <span>{row.getValue("total")}$</span>
                </div>
            )
        },
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
                                row.getValue("status") === "delivered",
                            "bg-yellow-100 text-yellow-800":
                                row.getValue("status") === "on way",
                            "bg-red-100 text-red-800":
                                row.getValue("status") === "canceled",
                        })}
                    >
                        {row.getValue("status")}
                    </Badge>
                </div>
            )
        },
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "country",
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Country"
                id="country"
            />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[70px] items-center">
                    <span>{row.getValue("country")}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "state",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="State" id="state" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[70px] items-center">
                    <span>{row.getValue("state")}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "city",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="City" id="city" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[70px] items-center">
                    <span>{row.getValue("city")}</span>
                </div>
            )
        },
    },
]
