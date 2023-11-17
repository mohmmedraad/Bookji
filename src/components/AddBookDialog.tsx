import { FC } from "react"
import { X } from "lucide-react"

import AddBookForm from "./AddBookForm"
import AddBookInput from "./AddBookInput"
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
    return (
        <Dialog>
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

                <AddBookForm />
            </DialogContent>
        </Dialog>
    )
}

export default AddBookDialog
