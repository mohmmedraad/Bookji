"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Star } from "lucide-react"

import { type BookType } from "@/lib/validations/book"
import BookCover from "@/components/ui/BookCover"
import { Checkbox } from "@/components/ui/Checkbox"
import { DataTableRowActions } from "@/components/ui/DataTableRowActions"

import { DataTableColumnHeader } from "./ui/DataTableColumnHeader"

export const Columns: ColumnDef<BookType>[] = [
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
        accessorKey: "categories",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="categories" />
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
        accessorKey: "inventory",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Inventory" />
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
            <DataTableColumnHeader column={column} title="rating" />
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
            <DataTableColumnHeader column={column} title="price" />
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
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
]
