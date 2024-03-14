"use client"

import { type FC } from "react"
import { type CookiesSettingsSchema } from "@/types"
import { useUser } from "@clerk/nextjs"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { useForm } from "react-hook-form"

import { cookiesSettingsSchema } from "@/lib/validations/auth"
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

interface CookiesSettingsProps {}

const CookiesSettings: FC<CookiesSettingsProps> = ({}) => {
    const form = useForm<CookiesSettingsSchema>({
        resolver: valibotResolver(cookiesSettingsSchema),
        defaultValues: {
            functionalCookies: true,
            analyticsCookies: true,
            performanceCookies: true,
            strictlyNecessary: true,
        },
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle>Cookies Settings</CardTitle>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form className="grid gap-3">
                        <FormField
                            control={form.control}
                            name="strictlyNecessary"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>
                                            Strictly Necessary
                                        </FormLabel>
                                        <FormDescription>
                                            These cookies are essential in order
                                            to use the website and use its
                                            features.
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
                            name="functionalCookies"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>
                                            Functional Cookies
                                        </FormLabel>
                                        <FormDescription>
                                            These cookies allow the website to
                                            provide personalized functionality.
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
                            name="performanceCookies"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>
                                            Performance Cookies
                                        </FormLabel>
                                        <FormDescription>
                                            These cookies help to improve the
                                            performance of the website.
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
                            name="analyticsCookies"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Analytics Cookies</FormLabel>
                                        <FormDescription>
                                            These cookies help to improve the
                                            analytics of the website.
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

export default CookiesSettings
