"use client"

import type { BookColumn } from "@/types"
import { type ColumnDef } from "@tanstack/react-table"

import BookCover from "@/components/ui/book-cover"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
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
        accessorKey: "author",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="author" id="author" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[150px] items-center ">
                    <span className="w-full overflow-x-hidden text-ellipsis text-gray-800">
                        {row.original.author}
                    </span>
                </div>
            )
        },
        enableSorting: true,
        enableHiding: true,
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
        cell: ({ row, table }) => (
            <BooksTableRowActions row={row} table={table} />
        ),
    },
]
