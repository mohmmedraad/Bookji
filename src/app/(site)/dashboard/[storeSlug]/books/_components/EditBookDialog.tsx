"use client"

import { useState, type FC } from "react"
import { Spinner } from "@nextui-org/react"

import { type BookFormSchema } from "@/lib/validations/book"
import { useUpdateBook } from "@/hooks/useUpdateBook"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import BookForm from "@/components/BookForm"

interface EditBookDialogProps {
    book: Omit<BookFormSchema, "categories"> & { id: number }
}

const EditBookDialog: FC<EditBookDialogProps> = ({ book }) => {
    const [open, setOpen] = useState(false)
    const { categories, isCategoriesLoading, isLoading, onSubmit } =
        useUpdateBook({ ...book })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Edit Book
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-[640px] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Book</DialogTitle>
                </DialogHeader>
                <Separator />
                {isCategoriesLoading ? (
                    <div className="flex h-full w-full items-center justify-center">
                        <Spinner size="lg" />
                    </div>
                ) : (
                    <BookForm
                        title={book.title}
                        description={book.description}
                        price={book.price}
                        inventory={book.inventory}
                        cover={book.cover}
                        author={book.author}
                        categories={categories}
                        isLoading={isLoading}
                        onSubmit={onSubmit}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}

export default EditBookDialog
