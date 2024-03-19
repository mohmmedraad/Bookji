"use client"

import { useState, type FC } from "react"
import { useRouter } from "next/navigation"
import { Book } from "@/db/schema"
import { Spinner } from "@nextui-org/react"
import { TRPCError } from "@trpc/server"
import { toast } from "sonner"

import { handleGenericError } from "@/lib/utils"
import { type BookFormSchema } from "@/lib/validations/book"
import { useBookCategories } from "@/hooks/useBookCategories"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog"
import { DropdownMenuItem } from "@/components/ui/DropdownMenu"
import { Separator } from "@/components/ui/Separator"
import BookForm from "@/components/BookForm"
import { trpc } from "@/app/_trpc/client"

interface EditBookDialogProps
    extends Omit<Book, "createdAt" | "updatedAt" | "userId"> {}

const EditBookDialog: FC<EditBookDialogProps> = ({
    cover,
    id,
    title,
    price,
    inventory,
    description,
}) => {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const {
        error,
        data: categories,
        isLoading: isCategoriesLoading,
    } = useBookCategories({ bookId: id })

    const { mutate: addBook } = trpc.books.add.useMutation({
        onSuccess: () => {
            toast.success("Book added successfully")
            setOpen(false)
        },
    })

    function onSubmit(data: BookFormSchema) {
        try {
            console.log("data: ", data)
            // addBook({ ...data })
        } catch (error) {
            console.log("error: ", error)
            // if (error instanceof TRPCError) {
            //     return handleTRPCError(error)
            // }
            // return handleGenericError()
        }
    }

    function handleTRPCError(error: TRPCError) {
        if (error.code === "UNAUTHORIZED") {
            return router.push("/sign-in")
        }

        if (error.code === "BAD_REQUEST")
            return toast.error("Invalid data, please check your inputs")
    }

    if (error) {
        handleGenericError()
        return null
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Edit Book
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
                {isCategoriesLoading ? (
                    <div className="flex h-full w-full items-center justify-center">
                        <Spinner size="lg" />
                    </div>
                ) : (
                    <BookForm
                        title={title}
                        description={description!}
                        price={price}
                        inventory={inventory}
                        cover={cover!}
                        categories={categories}
                        onSubmit={onSubmit}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}

export default EditBookDialog
