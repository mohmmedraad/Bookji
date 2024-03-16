"use client"

import Image from "next/image"
import Link from "next/link"
import { type PurchasesColumn } from "@/types"
import { type ColumnDef } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/Badge"
import Book from "@/components/ui/BookCover"
import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader"

export const Columns: ColumnDef<PurchasesColumn>[] = [
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
        accessorKey: "store",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Store" id="store" />
        ),
        cell: ({
            row: {
                original: { storeName, storeLogo },
            },
        }) => {
            return (
                <div className="flex w-[200px] items-center gap-3">
                    <Link
                        href={`/shop?stores=${storeName.replaceAll(" ", "+")}`}
                        className="group flex items-center gap-3"
                    >
                        <Image
                            src={storeLogo!}
                            width={28}
                            height={28}
                            alt={storeName}
                            className="h-7 w-7 rounded-full shadow-md"
                        />
                        <span className="group-hover:underline group-hover:underline-offset-4">
                            {storeName}
                        </span>
                    </Link>
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
        enableSorting: false,
    },
    {
        accessorKey: "total",
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Total"
                id="total"
                sortByKey="total"
            />
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
        enableSorting: false,
        enableHiding: true,
    },
]
