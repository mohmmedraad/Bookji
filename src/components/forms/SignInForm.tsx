"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { isClerkAPIResponseError, useSignIn } from "@clerk/nextjs"
import type { SignInStatus } from "@clerk/types"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { email, minLength, object, string, type Input } from "valibot"

import {
    clerkError,
    getEmailAddressId,
    handleGenericError,
    isAuthNotComplete,
} from "@/lib/utils"
import useSignInForm from "@/hooks/useSignInForm"
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

const signInFormSchema = object({
    email: string([
        minLength(1, "Please enter your email."),
        email("The email address is badly formatted."),
    ]),
})

type SignInFormSchema = Input<typeof signInFormSchema>

const defaultValues: Partial<SignInFormSchema> = {
    email: "",
}

const SignInForm = () => {
    const { isLoaded, signIn, setActive } = useSignIn()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { setFormState } = useSignInForm()
    const form = useForm<SignInFormSchema>({
        resolver: valibotResolver(signInFormSchema),
        defaultValues,
    })
    const router = useRouter()

    async function onSubmit(data: SignInFormSchema) {
        // setIsSubmitting(true)
        if (!isLoaded) return
        try {
            await createUser(data)
            sendVerificationEmail()
            setFormState("verify")
            await setSession()
        } catch (error) {
            // setIsSubmitting(false)
            handleSignInError(error)
        }
    }

    async function createUser(data: SignInFormSchema) {
        await signIn!.create({
            identifier: data.email,
        })
    }

    function sendVerificationEmail() {
        void signIn!.prepareFirstFactor({
            emailAddressId: getEmailAddressId(signIn!),
            strategy: "email_link",
            redirectUrl: "http://localhost:3000/verification",
        })
    }

    async function setSession() {
        if (isAuthNotComplete(signIn!.status)) return
        await setActive!({ session: signIn!.createdSessionId })
    }

    function handleSignInError(error: unknown) {
        if (!isClerkAPIResponseError(error)) return handleGenericError()

        const { errorCode, errorMessage } = clerkError(error)

        if (errorCode === "form_identifier_not_found")
            setEmailError(errorMessage)

        if (errorCode === "session_exists")
            return handleSessionExistsError(errorMessage)
    }

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
                    type="submit"
                    disabled={form.formState.isSubmitting}
                >
                    Sign In
                </Button>
            </form>
        </Form>
    )
}

export default SignInForm
