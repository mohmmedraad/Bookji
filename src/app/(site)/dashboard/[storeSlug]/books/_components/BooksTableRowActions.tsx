"use client"

import EditBookDialog from "./EditBookDialog"
import type { BookColumn } from "@/types"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { type Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/Button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"

import DeleteBookDialog from "./DeleteBookDialog"

interface BooksTableRowActionsProps<TData> {
    row: Row<TData>
    book: BookColumn
}

export function BooksTableRowActions<TData>({
    row,
    book,
}: BooksTableRowActionsProps<TData>) {
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
                <EditBookDialog {...book} />

                <DropdownMenuSeparator />

                <DeleteBookDialog />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
