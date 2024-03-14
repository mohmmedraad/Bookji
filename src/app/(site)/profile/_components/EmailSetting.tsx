"use client"

import { type FC } from "react"
import { type EmailSettingSchema } from "@/types"
import { useUser } from "@clerk/nextjs"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { useForm } from "react-hook-form"

import { emailSettingSchema } from "@/lib/validations/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/Form"
import { Switch } from "@/components/ui/Switch"

interface EmailSettingProps {}

const EmailSetting: FC<EmailSettingProps> = ({}) => {
    const { user, isLoaded, isSignedIn } = useUser()
    const form = useForm<EmailSettingSchema>({
        resolver: valibotResolver(emailSettingSchema),
        defaultValues: {
            newOrder: true,
            itemUpdate: true,
            itemComment: true,
            buyerReview: true,
        },
    })
    if (!isLoaded) {
        return null
    }

    if (isLoaded && !isSignedIn) {
        return null
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Email Settings</CardTitle>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form className="grid gap-3">
                        <FormField
                            control={form.control}
                            name="newOrder"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>New Order</FormLabel>
                                        <FormDescription>
                                            Send an email when receive email
                                            notifications for new orders.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="itemUpdate"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Item Update</FormLabel>
                                        <FormDescription>
                                            Send an email when an item iU+2019ve
                                            purchased is updated
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="itemComment"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Item Comment</FormLabel>
                                        <FormDescription>
                                            Send me an email when someone
                                            comment on one of my items
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="buyerReview"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Buyer Review</FormLabel>
                                        <FormDescription>
                                            Send me an email when someone leaves
                                            a review with their rating.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default EmailSetting
