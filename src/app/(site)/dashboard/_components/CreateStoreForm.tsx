"use client"

import { useState, type FC } from "react"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { Plus, Upload } from "lucide-react"
import { useForm } from "react-hook-form"

import {
    newStoreSchema,
    storeLogoSchema,
    storeThumbnailSchema,
    type NewStoreSchema,
} from "@/lib/validations/store"
import { useCreateStore } from "@/hooks/mutations/useCreateStore"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import UploadingZone from "@/components/uploadFileDropZone copy/UploadingZone"

interface CreateStoreButtonProps {}

const CreateStoreForm: FC<CreateStoreButtonProps> = ({}) => {
    const [open, setOpen] = useState(false)
    const form = useForm<NewStoreSchema>({
        resolver: valibotResolver(newStoreSchema),
        defaultValues: {
            name: "",
            description: "",
            logo: "",
            thumbnail: "",
        },
    })
    const { createStore, isLoading } = useCreateStore(setOpen, form)

    function onSubmit(data: NewStoreSchema) {
        createStore(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button>
                    <Card className="flex h-full min-h-[230px] flex-col items-center justify-center gap-6 transition-shadow duration-300 hover:shadow-xl">
                        <Plus className="h-8 w-8 text-primary" />
                        <span className="text-sm text-primary">
                            Create Store
                        </span>
                    </Card>
                </button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create new store</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            void form.handleSubmit(onSubmit)()
                        }}
                    >
                        <div className="mb-8 grid gap-6">
                            <FormField
                                control={form.control}
                                name="thumbnail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <UploadingZone
                                                className="h-32 w-full rounded-md"
                                                {...field}
                                                endpoint="storeLogoUploader"
                                                schema={storeLogoSchema}
                                                uploadContent={
                                                    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                                                        <div className="flex items-center justify-center rounded-full border-[1px] border-solid border-gray-100 bg-background p-3">
                                                            <Upload className="h-4 w-4 text-primary" />
                                                        </div>
                                                        <p className="text-center text-xs text-gray-800">
                                                            <span className="text-primary">
                                                                Click to upload
                                                            </span>
                                                            or drag and drop
                                                            PNG, JPG, and max
                                                            image size (1MB)
                                                        </p>
                                                    </div>
                                                }
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="logo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <UploadingZone
                                                className="h-16 w-16 rounded-full"
                                                {...field}
                                                endpoint="storeThumbnailUploader"
                                                schema={storeThumbnailSchema}
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
                        </div>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Store name"
                                            {...field}
                                            type="text"
                                            className="w-full"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Enter store name
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Store description"
                                            {...field}
                                            rows={4}
                                            className="w-full"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Enter store description
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="mt-6 w-full"
                            disabled={isLoading}
                        >
                            Create store
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateStoreForm
