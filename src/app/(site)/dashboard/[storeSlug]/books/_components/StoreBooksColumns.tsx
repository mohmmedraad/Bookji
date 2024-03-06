"use client"

import type { BookColumn } from "@/types"
import { type ColumnDef } from "@tanstack/react-table"

import BookCover from "@/components/ui/BookCover"
import { Checkbox } from "@/components/ui/Checkbox"
import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader"
import Stars from "@/app/(site)/book/[bookSlug]/_components/Stars"

import { BooksTableRowActions } from "./BooksTableRowActions"

export const Columns: ColumnDef<BookColumn>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "title",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="books" id="book" />
        ),
        cell: ({ row }) => {
            console.log("cover: ", row.getValue("cover"))
            return (
                <div className="flex w-[250px] items-center gap-3">
                    <BookCover
                        src={row.original.cover || "/placeholder.png"}
                        alt={`The Secret Story cover`}
                        width={40}
                        height={56}
                        className="h-14 w-10"
                    />
                    <p>{row.getValue("title")}</p>
                </div>
            )
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "orders",
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="orders"
                sortByKey="orders"
            />
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
        accessorKey: "inventory",
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Inventory"
                sortByKey="inventory"
            />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[100px] items-center">
                    <span className="text-gray-800">
                        {row.getValue("inventory")}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "rating",
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Rating"
                sortByKey="rating"
            />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[100px] items-center gap-3">
                    <Stars
                        className="mt-0 gap-0"
                        isStatic
                        stars={row.getValue("rating")}
                        starsClassName="h-4 w-4"
                    />
                </div>
            )
        },
    },
    {
        accessorKey: "price",
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Price"
                sortByKey="price"
            />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[100px] items-center">
                    <span>{row.getValue("price")}$</span>
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <BooksTableRowActions row={row} book={row.original} />
        ),
    },
]
