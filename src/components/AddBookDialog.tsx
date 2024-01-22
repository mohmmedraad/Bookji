"use client"

import { useState, type FC } from "react"
import { useRouter } from "next/navigation"
import { TRPCError } from "@trpc/server"
import { toast } from "sonner"

import { handleGenericError } from "@/lib/utils"
import { type BookFormSchema } from "@/lib/validations/book"
import { trpc } from "@/app/_trpc/client"

import BookForm from "./BookForm"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/Dialog"
import { DropdownMenuItem } from "./ui/DropdownMenu"
import { Separator } from "./ui/Separator"

interface AddBookDialogProps {}

const AddBookDialog: FC<AddBookDialogProps> = ({}) => {
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const { mutate: addBook } = trpc.addBook.useMutation({
        onSuccess: () => {
            toast.success("Book added successfully")
            setOpen(false)
        },
    })

    function onSubmit(data: BookFormSchema) {
        try {
            addBook({ ...data })
        } catch (error) {
            if (error instanceof TRPCError) {
                return handleTRPCError(error)
            }
            return handleGenericError()
        }
    }

    function handleTRPCError(error: TRPCError) {
        if (error.code === "UNAUTHORIZED") {
            return router.push("/sign-in")
        }

        if (error.code === "BAD_REQUEST")
            return toast.error("Invalid data, please check your inputs")
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

                <BookForm closeFun={() => setOpen(false)} onSubmit={onSubmit} />
            </DialogContent>
        </Dialog>
    )
}

export default AddBookDialog
