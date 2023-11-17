"use client"

import { FC, useState } from "react"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { useForm, UseFormReturn } from "react-hook-form"

import { addBookFormSchema, AddBookFormSchema } from "@/lib/validations/book"
import { Input as FormInput } from "@/components/ui/Input"

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
import { Textarea } from "./ui/Textarea"

interface AddBookFormProps {}

const defaultValues: Partial<AddBookFormSchema> = {
    title: "",
    description: "",
    tags: [],
    price: "0",
    inventory: "1",
}
const AddBookForm: FC<AddBookFormProps> = ({}) => {
    const form = useForm<AddBookFormSchema>({
        resolver: valibotResolver(addBookFormSchema),
        defaultValues,
    })
    const [file, setFile] = useState<Blob | null>(null)
    function onSubmit(data: AddBookFormSchema) {
        if (!file) return
        console.log(file, data)
    }
    return (
        <Form {...form}>
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    void form.handleSubmit(onSubmit)(event)
                }}
                className="grid  gap-8  sm:grid-cols-addBook"
            >
                <AddBookInput onFile={(file) => setFile(file)} />
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

export default AddBookForm
