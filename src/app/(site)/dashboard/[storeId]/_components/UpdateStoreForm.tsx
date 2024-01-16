"use client"

import { type FC } from "react"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { storeInfoSchema, type StoreInfoSchema } from "@/lib/validations/store"
import { Button } from "@/components/ui/Button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"

import DeleteStoreDialog from "./DeleteStoreDialog"

interface UpdateStoreFormProps {}

const UpdateStoreForm: FC<UpdateStoreFormProps> = ({}) => {
    const form = useForm<StoreInfoSchema>({
        resolver: valibotResolver(storeInfoSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    })

    function onSubmit(data: StoreInfoSchema) {
        toast.success(JSON.stringify(data))
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
                                        <Input
                                            {...field}
                                            placeholder="Your store description"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="mt-4 flex gap-4">
                            <Button type="submit">Save</Button>
                            <DeleteStoreDialog />
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default UpdateStoreForm
