"use client"

import { useEffect, type FC } from "react"
import { useSignUp } from "@clerk/nextjs"
import { PenSquare } from "lucide-react"

import useCount from "@/hooks/useCount"
import useSignUpForm from "@/hooks/useSignUpForm"

import { Button } from "../ui/Button"

const VerifySignUpForm: FC = () => {
    const { countdownTime, restartCountdown } = useCount()
    const { setFormState } = useSignUpForm()
    const { signUp } = useSignUp()

    function sendVerificationEmail() {
        void signUp!.prepareEmailAddressVerification({
            strategy: "email_link",
            redirectUrl: "http://localhost:3000/verification",
        })
    }
    return (
        <div>
            <p className="text-2xl font-bold">Verify your email</p>
            <p className="mt-2 text-base text-gray-700">
                to continue to Book Store
            </p>
            <div className="my-6 flex max-w-min items-center gap-4 rounded-md border-2 border-gray-100 bg-gray-50 p-1">
                <p className="text-sm text-gray-700">{signUp?.emailAddress}</p>
                <Button
                    variant={"ghost"}
                    className="p-0"
                    onClick={() => setFormState("signUp")}
                >
                    <PenSquare className="text-2xl text-primary" />
                </Button>
            </div>
            <p>Verification link</p>
            <p className="mt-2 text-gray-500">
                Use the verification link sent to your email address
            </p>
            <button
                className="mt-4 text-primary disabled:text-primary/25"
                disabled={countdownTime > 0}
                onClick={() => {
                    sendVerificationEmail()
                    restartCountdown()
                }}
            >
                Didn&apos;t receive a link? Resend{" "}
                {countdownTime != 0 && `(${countdownTime})`}
            </button>
        </div>
    )
}

export default VerifySignUpForm
