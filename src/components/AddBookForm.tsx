"use client"

import { useState, type FC } from "react"
import { useRouter } from "next/navigation"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { TRPCError } from "@trpc/server"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { handleGenericError } from "@/lib/utils"
import {
    addBookFormSchema,
    type AddBookFormSchema,
} from "@/lib/validations/book"
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
import { Textarea } from "./ui/Textarea"

interface AddBookFormProps {
    closeFun: () => void
}

const defaultValues: Partial<AddBookFormSchema> = {
    title: "",
    description: "",
    tags: [],
    price: "0",
    inventory: 1,
}
const AddBookForm: FC<AddBookFormProps> = ({ closeFun }) => {
    const form = useForm<AddBookFormSchema>({
        resolver: valibotResolver(addBookFormSchema),
        defaultValues,
    })
    const [coverUrl, setCoverUrl] = useState<string | null>(null)
    const router = useRouter()

    const { mutate: addBook } = trpc.addBook.useMutation({
        onSuccess: () => {
            toast.success("Book added successfully")
            closeFun()
        },
    })

    function onSubmit(data: AddBookFormSchema) {
        console.log(data)
        if (!coverUrl) return
        try {
            addBook({ ...data, cover: coverUrl })
        } catch (error) {
            console.log("error: ", error)
            if (error instanceof TRPCError) {
                return handleTRPCError(error)
            }
            return handleGenericError()
        }
    }

    function handleTRPCError(error: TRPCError) {
        if (error.code === "UNAUTHORIZED") {
            return router.push("/sign-in")
        }

        if (error.code === "BAD_REQUEST")
            return toast.error("Invalid data, please check your inputs")
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
                <AddBookInput
                    onCoverUploaded={(coverUrl) => setCoverUrl(coverUrl)}
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

export default AddBookForm
