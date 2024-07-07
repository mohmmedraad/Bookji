"use client"

import { type FC } from "react"

import { type StoreInfoSchema } from "@/lib/validations/store"
import { useUpdateStore } from "@/hooks/useUpdateStore"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/Textarea"

import DeleteStoreDialog from "./DeleteStoreDialog"

interface UpdateStoreFormProps {
    name: string
    description: string
}

const UpdateStoreForm: FC<UpdateStoreFormProps> = (defaultInfo) => {
    const { isLoading, updateStore, form } = useUpdateStore({ ...defaultInfo })

    function onSubmit(data: StoreInfoSchema) {
        updateStore(data)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Update your store</CardTitle>
                <CardDescription>Change your store info</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault()
                            void form.handleSubmit(onSubmit)(event)
                        }}
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="mb-4">
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Your store name"
                                        />
                                    </FormControl>
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
                                            {...field}
                                            placeholder="Your store description"
                                            rows={4}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="mt-4 flex gap-4">
                            <Button type="submit" disabled={isLoading}>
                                Save
                            </Button>
                            <DeleteStoreDialog />
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default UpdateStoreForm
