"use client"

import { type FC } from "react"

import { useGeneralInformationForm } from "@/hooks/mutations/useGeneralInformationForm"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface GeneralInformationProps {
    firstName: string | null
    lastName: string | null
    username: string | null
}

const GeneralInformation: FC<GeneralInformationProps> = (props) => {
    const { form, isLoading, handleSubmit } = useGeneralInformationForm({
        ...props,
    })
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            void handleSubmit()
                        }}
                    >
                        <div className="grid gap-6 md:grid-cols-2">
                            <FormField
                                name="firstName"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="First Name"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="lastName"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Last Name"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="username"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>username</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="username"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button className="mt-8 " disabled={isLoading}>
                            Update profile
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default GeneralInformation
