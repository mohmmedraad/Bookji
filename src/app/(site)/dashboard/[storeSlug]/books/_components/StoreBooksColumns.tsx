"use client"

import { type Book as BookType } from "@/db/schema"
import { type ColumnDef } from "@tanstack/react-table"

import BookCover from "@/components/ui/BookCover"
import { Checkbox } from "@/components/ui/Checkbox"
import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader"
import Stars from "@/app/(site)/book/[bookSlug]/_components/Stars"

import { DataTableRowActions } from "./DataTableRowActions"

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
                        src={row.original.cover!}
                        alt={`The Secret Story cover`}
                        width={40}
                        height={56}
                        className="h-14 w-10"
                    />
                    <p>{row.original.title}</p>
                </div>
            )
        },
        // filterFn: (row, id, value: string) => {
        //     return row.original.title
        //         .toLowerCase()
        //         .includes(value.toLowerCase())
        // },
        enableSorting: false,
        enableHiding: false,
    },
    // {
    //     accessorKey: "orders",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="orders" />
    //     ),
    //     cell: ({ row }) => {
    //         return (
    //             <div className="flex w-[100px] items-center">
    //                 <span className="text-gray-800">
    //                     {row.getValue("orders")}
    //                 </span>
    //             </div>
    //         )
    //     },
    // },
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
            <DataTableColumnHeader column={column} title="Rating" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[100px] items-center gap-3">
                    <Stars
                        className="mt-0 gap-0"
                        isStatic
                        stars={5}
                        starsClassName="h-4 w-4"
                    />
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
                <div className="flex w-[100px] items-center">
                    <span>{row.getValue("price")}$</span>
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <DataTableRowActions row={row} book={row.original} />
        ),
    },
]
