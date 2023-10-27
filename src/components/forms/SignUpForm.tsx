"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import type { ClerkAPIError } from "@/types"
import { isClerkAPIResponseError, useSignUp } from "@clerk/nextjs"
import { type SignUpStatus } from "@clerk/types"
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

import { clerkError, handleGenericError, isAuthNotComplete } from "@/lib/utils"
import useSignUpForm from "@/hooks/useSignUpForm"
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
    const { isLoaded, signUp, setActive } = useSignUp()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { setFormState } = useSignUpForm()
    const form = useForm<SignUpFormSchema>({
        resolver: valibotResolver(signUpFormSchema),
        defaultValues,
    })
    const router = useRouter()

    async function onSubmit(data: SignUpFormSchema) {
        setIsSubmitting(true)
        if (!isLoaded) return

        try {
            await createUser(data)

            sendVerificationEmail()

            setFormState("verify")

            await setSession()
        } catch (error) {
            setIsSubmitting(false)
            handleSignInError(error)
        }
    }

    async function createUser(data: SignUpFormSchema) {
        await signUp!.create({
            emailAddress: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
        })
    }

    function sendVerificationEmail() {
        void signUp!.prepareEmailAddressVerification({
            strategy: "email_link",
            redirectUrl: "http://localhost:3000/verification",
        })
    }

    async function setSession() {
        if (isAuthNotComplete(signUp!.status)) return
        await setActive!({ session: signUp!.createdSessionId })
    }

    // function isSignUpNotComplete(status: SignUpStatus | null) {
    //     return !status || status !== "complete"
    // }

    function handleSignInError(error: unknown) {
        if (!isClerkAPIResponseError(error)) return handleGenericError()
        const { errorCode, errorMessage } = clerkError(error)
        if (errorCode === "form_identifier_exists")
            return setEmailError(errorMessage)
        if (errorCode === "session_exists")
            handleSessionExistsError(errorMessage)
    }

    // function clerkError(error: ClerkAPIError) {
    //     const errorCode = error.errors[0].code
    //     const errorMessage = error.errors[0].message
    //     return { errorCode, errorMessage }
    // }

    // function handleGenericError() {
    //     toast.error("Something went wrong. Please try again later.")
    // }

    function handleSessionExistsError(errorMessage: string) {
        toast.error(errorMessage)
        router.push("/")
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
