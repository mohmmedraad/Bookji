"use client"

// import EditBookDialog from "./EditBookDialog"
import type { BookColumn } from "@/types"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { type Row, type Table } from "@tanstack/react-table"

import { useDeleteBooks } from "@/hooks/useDeleteBooks"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"

import DeleteBookDialog from "./DeleteBookDialog"
import EditBookDialog from "./EditBookDialog"

interface BooksTableRowActionsProps {
    row: Row<BookColumn>
    table: Table<BookColumn>
}

export function BooksTableRowActions({
    table,
    row,
}: BooksTableRowActionsProps) {
    const { handleDeleteBooks, isLoading, open, setOpen } = useDeleteBooks()
    const book = row.original

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                >
                    <DotsHorizontalIcon className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <EditBookDialog
                    book={{
                        id: book.id,
                        title: book.title,
                        author: book.author,
                        cover: book.cover!,
                        inventory: book.inventory,
                        price: book.price,
                        description: book.description!,
                    }}
                />
                <DropdownMenuSeparator />

                <DeleteBookDialog
                    onClick={() =>
                        handleDeleteBooks(table.getSelectedRowModel().rows, row)
                    }
                    isLoading={isLoading}
                    open={open}
                    setOpen={setOpen}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
