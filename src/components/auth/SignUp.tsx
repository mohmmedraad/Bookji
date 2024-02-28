"use client"

import { useEffect, type FC } from "react"
import Link from "next/link"

import useSignUpForm from "@/hooks/useSignUpForm"

import SignUpForm from "../forms/SignUpForm"
import OauthSignIn from "./OauthSignIn"
import VerifySignUpForm from "./VerifySignUpForm"

interface SignUpProps {
    origin: string | undefined
}

const SignUp: FC<SignUpProps> = ({ origin }) => {
    const formState = useSignUpForm((state) => state.formState)
    const setOrigin = useSignUpForm((state) => state.setOrigin)

    useEffect(() => {
        if (!origin) return
        setOrigin(origin)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className="max-w-[482px]">
            {formState === "signUp" ? (
                <>
                    <p className="text-2xl font-semibold">
                        Sign up to Book Store
                    </p>
                    <p className="mt-2 text-base font-medium text-gray-500">
                        Sign up with social account or enter your details
                    </p>
                    <OauthSignIn />
                    <SignUpForm />
                    <p className="text-sm text-gray-400">
                        By confirming your email, you agree to our{" "}
                        <a className="font-medium text-gray-800 hover:underline">
                            Terms of Service
                        </a>{" "}
                        and that you have read and understood our{" "}
                        <a className="font-medium text-gray-800 hover:underline">
                            Privacy Policy.
                        </a>
                    </p>
                    <p className="mt-4 text-sm text-gray-400">
                        Already have an account?{" "}
                        <Link
                            className="font-medium text-primary  hover:underline"
                            href={`/sign-in?_origin=${origin || "/"}`}
                        >
                            Sign In
                        </Link>
                    </p>
                </>
            ) : (
                <VerifySignUpForm />
            )}
        </div>
    )
}

export default SignUp
