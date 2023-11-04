"use client"

import Link from "next/link"

import useSignInForm from "@/hooks/useSignInForm"

import SignInForm from "../forms/SignInForm"
import OauthSignIn from "./OauthSignIn"
import VerifySignInForm from "./VerifySignInForm"

const SignUp = () => {
    const formState = useSignInForm((state) => state.formState)
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
                    <OauthSignIn />
                    <SignInForm />
                    <p className="text-sm text-gray-400">
                        Dos&apos;t have an account?{" "}
                        <Link
                            className="font-medium text-primary hover:underline"
                            href="sign-up"
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

export default SignUp
