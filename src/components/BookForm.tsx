"use client"

import { useState, type FC } from "react"
import { useRouter } from "next/navigation"
import { type Category } from "@/types"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { TRPCError } from "@trpc/server"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { handleGenericError } from "@/lib/utils"
import { bookFormSchema, type BookFormSchema } from "@/lib/validations/book"
import { Input as FormInput } from "@/components/ui/Input"
import { trpc } from "@/app/_trpc/client"

import AddBookInput from "./AddBookInput"
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

interface BookFormProps extends Partial<BookFormSchema> {
    closeFun: () => void
    onSubmit: (data: BookFormSchema) => void
    // title?: string
    // description?: string
    // categories?: Category[]
    // price?: string
    // inventory?: number
}

// const defaultValues: Partial<BookFormSchema> = {
//     title: "",
//     description: "",
//     categories: [],
//     price: "0",
//     inventory: 1,
// }

const BookForm: FC<BookFormProps> = ({
    closeFun,
    title = "",
    description = "",
    categories = [],
    price = "0",
    inventory = 1,
    cover = "",
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

    const [selectedCategory, setSelectedCategory] = useState<Category[] | null>(
        null
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
                                <AddBookInput {...field} />
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
                        disabled={form.formState.isSubmitting}
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
