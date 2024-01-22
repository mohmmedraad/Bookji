"use client"

import { useState, type FC } from "react"

import { type BookFormSchema } from "@/lib/validations/book"
import { useCreateBook } from "@/hooks/useCreateBook"
import { DropdownMenuItem } from "@/components/ui/DropdownMenu"
import { Separator } from "@/components/ui/Separator"

import BookForm from "./BookForm"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/Dialog"

interface AddBookDialogProps {}

const AddBookDialog: FC<AddBookDialogProps> = ({}) => {
    const [open, setOpen] = useState(false)
    const { createBook, isLoading } = useCreateBook(setOpen)

    function onSubmit(data: BookFormSchema) {
        createBook(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Add Book
                </DropdownMenuItem>
            </DialogTrigger>
            {/**
             * TODO: Change the viewport units to be dynamic
             */}
            <DialogContent className="max-h-[90vh] max-w-[640px] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add Book</DialogTitle>
                </DialogHeader>
                <Separator />

                <BookForm isLoading={isLoading} onSubmit={onSubmit} />
            </DialogContent>
        </Dialog>
    )
}

export default AddBookDialog
