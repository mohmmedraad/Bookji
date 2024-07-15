import { type FC } from "react"
import { useStore } from "@/store/useStore"
import { Spinner } from "@nextui-org/react"
import { toast } from "sonner"

import { useDeleteStore } from "@/hooks/mutations/useDeleteStore"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface DeleteStoreDialogProps {}

const DeleteStoreDialog: FC<DeleteStoreDialogProps> = ({}) => {
    const { handleDeleteStore, isLoading } = useDeleteStore()
    const storeName = useStore((store) => store.name)
    function handleClick() {
        handleDeleteStore()
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
                    <DialogTitle>Delete {storeName}</DialogTitle>
                    <DialogDescription>
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <Spinner size="md" />
                            </div>
                        ) : (
                            <span>
                                By clicking the delete button your store well be
                                lost including it data
                            </span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        type="submit"
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
