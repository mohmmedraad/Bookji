import {
    type ButtonHTMLAttributes,
    type Dispatch,
    type FC,
    type SetStateAction,
} from "react"

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

interface DeleteBookDialogProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading: boolean
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
}

const DeleteBookDialog: FC<DeleteBookDialogProps> = ({
    isLoading,
    open,
    setOpen,
    ...props
}) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Delete
                    <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="max-w-[400px]">
                <DialogHeader className="text-center">
                    <DialogTitle>Delete books</DialogTitle>
                    <DialogDescription>
                        By clicking the delete button your data well be lost
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        variant={"destructive"}
                        className="w-full"
                        disabled={isLoading}
                        {...props}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteBookDialog
