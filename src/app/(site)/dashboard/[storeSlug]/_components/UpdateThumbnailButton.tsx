import { useEffect, useState, type FC } from "react"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { Camera, Pencil, Upload } from "lucide-react"
import { useForm } from "react-hook-form"
import { pick } from "valibot"

import {
    newStoreSchema,
    storeLogoSchema,
    storeThumbnailSchema,
} from "@/lib/validations/store"
import { useStore } from "@/hooks/useStore"
import { useUpdateThumbnail } from "@/hooks/useUpdateThumbnail"
import { Button } from "@/components/ui/Button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/Form"
import UploadingZone from "@/components/uploadFileDropZone copy/UploadingZone"

interface UpdateThumbnailButtonProps {}

const UpdateThumbnailButton: FC<UpdateThumbnailButtonProps> = ({}) => {
    const [open, setOpen] = useState(false)

    const form = useForm<{ fileUrl: string }>({
        defaultValues: {
            fileUrl: "",
        },
        resolver: valibotResolver(pick(newStoreSchema, ["thumbnail"])),
    })
    const { updateThumbnail } = useUpdateThumbnail(setOpen)

    function onSubmit(data: { fileUrl: string }) {
        updateThumbnail(fileUrl)
    }

    const fileUrl = form.watch("fileUrl")

    useEffect(() => {
        if (!fileUrl) return
        onSubmit({ fileUrl })
    }, [fileUrl])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="absolute  bottom-3 right-3  flex gap-2 bg-black/40 text-xs text-white hover:bg-black/20 md:bottom-6 md:right-6 md:text-sm">
                    <Camera className="text-base" width={16} height={16} />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <Form {...form}>
                    <form className="w-full">
                        <FormField
                            control={form.control}
                            name="fileUrl"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-center">
                                    <FormControl>
                                        <UploadingZone
                                            className="h-28 w-full rounded-md"
                                            {...field}
                                            endpoint="storeThumbnailUploader"
                                            schema={storeThumbnailSchema}
                                            uploadContent={
                                                <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                                                    <div className="flex items-center justify-center rounded-full border-[1px] border-solid border-gray-100 bg-background p-3">
                                                        <Upload className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <p className="text-center text-xs text-gray-800">
                                                        <span className="text-primary">
                                                            Click to upload
                                                        </span>
                                                        or drag and drop PNG,
                                                        JPG, and max image size
                                                        (1MB)
                                                    </p>
                                                </div>
                                            }
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateThumbnailButton
