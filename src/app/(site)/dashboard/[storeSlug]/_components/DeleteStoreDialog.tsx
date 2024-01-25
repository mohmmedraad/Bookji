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

interface DeleteStoreDialogProps {}

const DeleteStoreDialog: FC<DeleteStoreDialogProps> = ({}) => {
    function handleClick() {
        toast.success("your store has been deleted successfully")
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"outline"} type="button">
                    Delete Store
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>
                        Delete {"{"}STORE NAME{"}"}{" "}
                    </DialogTitle>
                    <DialogDescription>
                        By clicking the delete button your store well be lost
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

export default DeleteStoreDialog
