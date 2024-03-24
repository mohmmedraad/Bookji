"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { isClerkAPIResponseError, useSignUp } from "@clerk/nextjs"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
    email,
    maxLength,
    minLength,
    object,
    string,
    type Input,
} from "valibot"

import { handleGenericError } from "@/lib/utils"
import {
    clerkError,
    handleSessionExistsError,
    isAuthNotComplete,
    sendSignUpVerificationEmail,
} from "@/lib/utils/auth"
import useSignUpForm from "@/hooks/useSignUpForm"
import { useWebsiteURL } from "@/hooks/useWebsiteURL"
import { Button } from "@/components/ui/Button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/Form"
import { Input as FormInput } from "@/components/ui/Input"

const signUpFormSchema = object({
    email: string([
        minLength(1, "Please enter your email."),
        email("The email address is badly formatted."),
    ]),
    firstName: string([minLength(3), maxLength(50)]),
    lastName: string([minLength(3), maxLength(50)]),
})

type SignUpFormSchema = Input<typeof signUpFormSchema>

const defaultValues: Partial<SignUpFormSchema> = {
    email: "",
    firstName: "",
    lastName: "",
}

const SignUpForm = () => {
    const { isLoaded, signUp, setSession } = useSignUp()
    const { setFormState, setEmailAddress, origin } = useSignUpForm()
    const form = useForm<SignUpFormSchema>({
        resolver: valibotResolver(signUpFormSchema),
        defaultValues,
    })
    const router = useRouter()
    const { websiteURL } = useWebsiteURL()

    async function onSubmit(data: SignUpFormSchema) {
        if (!isLoaded) return

        try {
            await createUser(data)
            setEmailAddress(data.email)

            setFormState("verify")
            await sendSignUpVerificationEmail(signUp, websiteURL!)

            await setUserSession()
        } catch (error) {
            handleSignUpError(error)
        }
    }

    async function createUser(data: SignUpFormSchema) {
        await signUp!.create({
            emailAddress: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.email.split("@")[0],
        })
    }

    async function setUserSession() {
        if (isAuthNotComplete(signUp!.status)) return

        await setSession!(signUp!.createdSessionId, handleSignUpComplete)
    }

    function handleSignUpComplete() {
        toast.success("You have successfully signed up!")
        router.push(origin)
        setFormState("signUp")
    }

    function handleSignUpError(error: unknown) {
        if (!isClerkAPIResponseError(error)) return handleGenericError()
        const { errorCode, errorMessage } = clerkError(error)

        if (errorCode === "form_identifier_exists")
            return setEmailError(errorMessage)

        if (errorCode === "session_exists")
            return handleSessionExistsError(errorMessage, router)
        return handleGenericError()
    }

    function setEmailError(errorMessage: string) {
        form.setError(
            "email",
            { message: errorMessage },
            {
                shouldFocus: true,
            }
        )
    }

    return (
        <Form {...form}>
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    void form.handleSubmit(onSubmit)(event)
                }}
            >
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem className="mb-4">
                            <FormLabel>First name</FormLabel>
                            <FormControl>
                                <FormInput
                                    type="text"
                                    placeholder="Enter your first name"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem className="mb-4">
                            <FormLabel>Last name</FormLabel>
                            <FormControl>
                                <FormInput
                                    placeholder="Enter your last name"
                                    type="text"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <FormInput
                                    type="email"
                                    placeholder="example@space.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    className="my-6 w-full"
                    disabled={form.formState.isSubmitting}
                    type="submit"
                >
                    Sign Up
                </Button>
            </form>
        </Form>
    )
}

export default SignUpForm
