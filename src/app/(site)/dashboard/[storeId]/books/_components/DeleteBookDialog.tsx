import { type FC } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/Button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog"
import {
    DropdownMenuItem,
    DropdownMenuShortcut,
} from "@/components/ui/DropdownMenu"

interface DeleteBookDialogProps {}

const DeleteBookDialog: FC<DeleteBookDialogProps> = ({}) => {
    function handleClick() {
        toast.success("your book has been deleted successfully")
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Delete
                    <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>
                        Delete {"{"}BOOK NAME{"}"}{" "}
                    </DialogTitle>
                    <DialogDescription>
                        By clicking the delete button your book well be lost
                        including it data
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        variant={"destructive"}
                        className="w-full"
                        onClick={handleClick}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteBookDialog
