"use client"

import Link from "next/link"
import { type Book } from "@/db/schema"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { type Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/Button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"

import DeleteBookDialog from "./DeleteBookDialog"
import EditBookDialog from "./EditBookDialog"

interface DataTableRowActionsProps<TData> {
    row: Row<TData>
    book: Book
}

export function DataTableRowActions<TData>({
    row,
    book,
}: DataTableRowActionsProps<TData>) {
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
