"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { isClerkAPIResponseError, useSignIn } from "@clerk/nextjs"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { email, minLength, object, string, type Input } from "valibot"

import {
    clerkError,
    handleGenericError,
    handleSessionExistsError,
    isAuthNotComplete,
    sendSignInVerificationEmail,
} from "@/lib/utils"
import useSignInForm from "@/hooks/useSignInForm"
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
    const { isLoaded, signIn, setSession } = useSignIn()
    const { setFormState, setEmailAddress } = useSignInForm()
    const form = useForm<SignInFormSchema>({
        resolver: valibotResolver(signInFormSchema),
        defaultValues,
    })
    const router = useRouter()
    const { websiteURL } = useWebsiteURL()

    async function onSubmit(data: SignInFormSchema) {
        if (!isLoaded) return
        try {
            await createUser(data)
            setEmailAddress(data.email)

            setFormState("verify")
            await sendSignInVerificationEmail(signIn, websiteURL!)

            await setUserSession()
        } catch (error) {
            handleSignInError(error)
        }
    }

    async function createUser(data: SignInFormSchema) {
        await signIn!.create({
            identifier: data.email,
        })
    }

    async function setUserSession() {
        if (isAuthNotComplete(signIn!.status)) return

        await setSession!(signIn!.createdSessionId, handleSignInComplete)
    }

    function handleSignInComplete() {
        toast.success("You have successfully signed in!")
        router.push("/")
        setFormState("signIn")
    }

    function handleSignInError(error: unknown) {
        if (!isClerkAPIResponseError(error)) return handleGenericError()

        const { errorCode, errorMessage } = clerkError(error)

        if (errorCode === "form_identifier_not_found")
            setEmailError(errorMessage)

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
