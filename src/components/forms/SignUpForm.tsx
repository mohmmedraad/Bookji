"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import type { ClerkAPIError } from "@/types"
// const SignUpForm = () => {
//     const { isLoaded, signUp, setActive } = useSignUp()
//     const { setFormState } = useSignUpForm()
//     const form = useForm<SignUpFormSchema>({
//         resolver: valibotResolver(signUpFormSchema),
//         defaultValues,
//     })
//     const router = useRouter()
//     const { websiteURL } = useWebsiteURL()

//     async function onSubmit(data: SignUpFormSchema) {
//         if (!isLoaded) return

//         try {
//             await createUser(data)

//             await sendSignUpVerificationEmail(signUp, websiteURL!)

//             setFormState("verify")
//             console.log("signUp.status: ", signUp.status)

//             await setSession()
//         } catch (error) {
//             handleSignUpError(error)
//         }
//     }

//     async function createUser(data: SignUpFormSchema) {
//         await signUp!.create({
//             emailAddress: data.email,
//             firstName: data.firstName,
//             lastName: data.lastName,
//         })
//     }

//     async function setSession() {
//         if (isAuthNotComplete(signUp!.status)) return
//         await setActive!({ session: signUp!.createdSessionId })
//         console.log(signUp!.status)
//         handleSignUpComplete()
//     }

//     function handleSignUpError(error: unknown) {
//         if (!isClerkAPIResponseError(error)) return handleGenericError()
//         const { errorCode, errorMessage } = clerkError(error)

//         if (errorCode === "form_identifier_exists")
//             return setEmailError(errorMessage)

//         if (errorCode === "session_exists")
//             return handleSessionExistsError(errorMessage, router)
//         return handleGenericError()
//     }

//     function handleSignUpComplete() {
//         console.log(window)
//         if (!window) return
//         window.close()
//     }

//     function setEmailError(errorMessage: string) {
//         form.setError(
//             "email",
//             { message: errorMessage },
//             {
//                 shouldFocus: true,
//             }
//         )
//     }

//     return (
//         <Form {...form}>
//             <form
//                 onSubmit={(event) => {
//                     event.preventDefault()
//                     void form.handleSubmit(onSubmit)(event)
//                 }}
//             >
//                 <FormField
//                     control={form.control}
//                     name="firstName"
//                     render={({ field }) => (
//                         <FormItem className="mb-4">
//                             <FormLabel>First name</FormLabel>
//                             <FormControl>
//                                 <FormInput
//                                     type="text"
//                                     placeholder="Enter your first name"
//                                     {...field}
//                                 />
//                             </FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />

//                 <FormField
//                     control={form.control}
//                     name="lastName"
//                     render={({ field }) => (
//                         <FormItem className="mb-4">
//                             <FormLabel>Last name</FormLabel>
//                             <FormControl>
//                                 <FormInput
//                                     placeholder="Enter your last name"
//                                     type="text"
//                                     {...field}
//                                 />
//                             </FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />
//                 <FormField
//                     control={form.control}
//                     name="email"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Email Address</FormLabel>
//                             <FormControl>
//                                 <FormInput
//                                     type="email"
//                                     placeholder="example@space.com"
//                                     {...field}
//                                 />
//                             </FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />
//                 <Button
//                     className="my-6 w-full"
//                     disabled={form.formState.isSubmitting}
//                     type="submit"
//                 >
//                     Sign Up
//                 </Button>
//             </form>
//         </Form>
//     )
// }

// export default SignUpForm
import {
    isClerkAPIResponseError,
    isMagicLinkError,
    MagicLinkErrorCode,
    useClerk,
    useSignUp,
} from "@clerk/nextjs"
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

import {
    clerkError,
    handleGenericError,
    handleSessionExistsError,
    isAuthNotComplete,
    sendSignUpVerificationEmail,
} from "@/lib/utils"
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

// pages/sign-up.jsx
// Render the sign up form.
// Collect user's email address and send a magic link with which
// they can sign up.
// function SignUpForm() {
//     const [emailAddress, setEmailAddress] = React.useState("")
//     const [expired, setExpired] = React.useState(false)
//     const [verified, setVerified] = React.useState(false)
//     const router = useRouter()
//     const { signUp, isLoaded, setSession } = useSignUp()

//     if (!isLoaded) {
//         return null
//     }

//     const { startMagicLinkFlow, cancelMagicLinkFlow } =
//         signUp.createMagicLinkFlow()

//     async function submit(e) {
//         e.preventDefault()
//         setExpired(false)
//         setVerified(false)
//         if (!signUp) return
//         try {
//             await signUp.create({
//                 emailAddress,
//                 firstName: "hello world",
//                 lastName: "hi world",
//             })

//             const su = await startMagicLinkFlow({
//                 redirectUrl: "http://localhost:3000/verification",
//             })

//             // Check the verification result.
//             const verification = su.verifications.emailAddress
//             if (verification.verifiedFromTheSameClient()) {
//                 setVerified(true)
//                 return
//             } else if (verification.status === "expired") {
//                 setExpired(true)
//             }

//             if (su.status === "complete") {
//                 // Sign up is complete, we have a session.
//                 // Navigate to the after sign up URL.
//                 void setSession(su.createdSessionId, () => router.push("/"))
//                 return
//             }
//         } catch (error) {
//             toast.error("something went wrong")
//         }
//     }

//     if (expired) {
//         return <div>Magic link has expired</div>
//     }

//     if (verified) {
//         return <div>Signed in on other tab</div>
//     }

//     return (
//         <form onSubmit={submit}>
//             <input
//                 type="email"
//                 value={emailAddress}
//                 onChange={(e) => setEmailAddress(e.target.value)}
//             />
//             <button type="submit">Sign up with magic link</button>
//         </form>
//     )
// }

const SignUpForm = () => {
    const { isLoaded, signUp, setActive, setSession } = useSignUp()
    const { setFormState, setEmailAddress } = useSignUpForm()
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
        })
    }

    async function setUserSession() {
        if (isAuthNotComplete(signUp!.status)) return
        await setSession!(signUp!.createdSessionId, handleSignUpComplete)
    }

    function handleSignUpComplete() {
        toast.success("You have successfully signed up!")
        router.push("/")
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
