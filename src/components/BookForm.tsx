"use client"

import { useEffect, useState, type FC } from "react"
import { type Category } from "@/types"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { Upload } from "lucide-react"
import { useForm } from "react-hook-form"

import {
    bookCoverSchema,
    bookFormSchema,
    type BookFormSchema,
} from "@/lib/validations/book"
import { useBookForm } from "@/hooks/useBookForm"
import { Input as FormInput } from "@/components/ui/Input"

import { Button } from "./ui/Button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/Form"
import { MultiSelect } from "./ui/MultiSelect"
import { Textarea } from "./ui/Textarea"
import UploadingZone from "./uploadFileDropZone copy/UploadingZone"

interface BookFormProps extends Partial<BookFormSchema> {
    isLoading?: boolean
    onSubmit: (data: BookFormSchema) => void
}

const BookForm: FC<BookFormProps> = ({
    title = "",
    description = "",
    categories = [],
    price = "0",
    inventory = 1,
    cover = "",

    isLoading = false,
    onSubmit,
}) => {
    const form = useForm<BookFormSchema>({
        resolver: valibotResolver(bookFormSchema),

        defaultValues: {
            title,
            description,
            categories,
            price,
            inventory,
            cover,
        },
    })

    const setForm = useBookForm((store) => store.setForm)

    useEffect(() => {
        setForm(form)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const [selectedCategory, setSelectedCategory] = useState<Category[] | null>(
        categories || null
    )

    return (
        <Form {...form}>
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    void form.handleSubmit(onSubmit)(event)
                }}
                className="grid  gap-8  sm:grid-cols-addBook"
            >
                <FormField
                    control={form.control}
                    name="cover"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <UploadingZone
                                    {...field}
                                    className="aspect-[2/3] w-full max-w-[176px] rounded-md"
                                    endpoint="bookCoverUploader"
                                    schema={bookCoverSchema}
                                    uploadContent={
                                        <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                                            <div className="flex items-center justify-center rounded-full border-[1px] border-solid border-gray-100 bg-background p-3">
                                                <Upload className="h-4 w-4 text-primary" />
                                            </div>
                                            <p className="text-center text-xs text-gray-800">
                                                <span className="text-primary">
                                                    Click to upload
                                                </span>{" "}
                                                or drag and drop PNG, JPG, and
                                                max image size (1MB)
                                            </p>
                                        </div>
                                    }
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div>
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="mb-4">
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <FormInput
                                        type="text"
                                        placeholder="Title"
                                        {...field}
                                        autoFocus
                                    />
                                </FormControl>
                                <FormDescription>
                                    Enter a title of the book
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="mb-4">
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        rows={3}
                                        maxLength={250}
                                        placeholder="description"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Enter a description of the book
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="categories"
                        render={({ field }) => (
                            <FormItem className="mb-4">
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <MultiSelect
                                        selected={selectedCategory}
                                        setSelected={setSelectedCategory}
                                        placeholder="Select a category"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Enter book category
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="gap-8 md:flex">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <FormInput
                                            type="number"
                                            placeholder="100"
                                            min={0}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="inventory"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Inventory</FormLabel>
                                    <FormControl>
                                        <FormInput
                                            type="number"
                                            placeholder="100"
                                            min={0}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button
                        className="my-6 w-full"
                        disabled={isLoading}
                        type="submit"
                    >
                        Add Book
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default BookForm
