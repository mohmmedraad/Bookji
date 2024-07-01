"use client"

import { useEffect, type FC } from "react"
import Link from "next/link"
import useSignInForm from "@/store/useSignInForm"

import SignInForm from "@/components/forms/sign-in-form"
import OauthSignIn from "@/components/auth/oauth-sign-in"
import VerifySignInForm from "@/components/auth/verify-sign-in-form"

interface SignInProps {
    origin: string | undefined
}

const SignIn: FC<SignInProps> = ({ origin }) => {
    const formState = useSignInForm((state) => state.formState)
    const setOrigin = useSignInForm((state) => state.setOrigin)

    useEffect(() => {
        if (!origin) return
        setOrigin(origin)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="max-w-[482px]">
            {formState === "signIn" ? (
                <>
                    <p className="text-2xl font-semibold">
                        Sign in to Book Store
                    </p>
                    <p className="mt-2 text-base font-medium text-gray-500">
                        Sign in with social account or enter your details
                    </p>
                    <OauthSignIn redirectUrlComplete={origin} />
                    <SignInForm />
                    <p className="text-sm text-gray-400">
                        Dos&apos;t have an account?{" "}
                        <Link
                            className="font-medium text-primary hover:underline"
                            href={`/sign-up?_origin=${origin || "/"}`}
                        >
                            Sign Up
                        </Link>
                    </p>
                </>
            ) : (
                <VerifySignInForm />
            )}
        </div>
    )
}

export default SignIn
