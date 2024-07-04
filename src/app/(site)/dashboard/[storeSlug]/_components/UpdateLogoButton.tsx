import { useEffect, useState, type FC } from "react"
import { useStore } from "@/store/useStore"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { Pencil, Upload } from "lucide-react"
import { useForm } from "react-hook-form"
import { pick } from "valibot"

import { newStoreSchema, storeLogoSchema } from "@/lib/validations/store"
import { useUpdateLogo } from "@/hooks/useUpdateLogo"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/Form"
import UploadingZone from "@/components/uploadFileDropZone copy/UploadingZone"

interface UpdateLogoButtonProps {}

const UpdateLogoButton: FC<UpdateLogoButtonProps> = ({}) => {
    const [open, setOpen] = useState(false)
    const form = useForm<{ fileUrl: string }>({
        defaultValues: {
            fileUrl: "",
        },
        resolver: valibotResolver(pick(newStoreSchema, ["logo"])),
    })

    const { updateLogo } = useUpdateLogo(setOpen)

    function onSubmit(data: { fileUrl: string }) {
        console.log("data: ", data)
        updateLogo(data.fileUrl)
    }

    const fileUrl = form.watch("fileUrl")

    useEffect(() => {
        if (!fileUrl) return
        onSubmit({ fileUrl })
    }, [fileUrl])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="absolute bottom-[15%] right-1/4 h-fit translate-x-1/2 translate-y-1/2 rounded-full p-3">
                    <Pencil
                        className="aspect-square text-white"
                        width={16}
                        height={16}
                    />
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
                                    <FormControl className="w-full">
                                        <UploadingZone
                                            className="h-16 w-16 rounded-full"
                                            {...field}
                                            endpoint="storeThumbnailUploader"
                                            schema={storeLogoSchema}
                                            uploadContent={
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <div className="flex items-center justify-center rounded-full border-[1px] border-solid border-gray-100 bg-background p-3">
                                                        <Upload className="h-3 w-3 text-primary" />
                                                    </div>
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

export default UpdateLogoButton
