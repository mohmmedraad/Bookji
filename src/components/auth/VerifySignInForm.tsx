"use client"

import { useEffect, type FC } from "react"
import { useSignIn, useSignUp } from "@clerk/nextjs"
import { PenSquare } from "lucide-react"

import { handleGenericError } from "@/lib/utils"
import useCount from "@/hooks/useCount"
import useSignInForm from "@/hooks/useSignInForm"

import { Button } from "../ui/Button"

const VerifySignInForm: FC = () => {
    const { countdownTime, restartCountdown } = useCount()
    const { setFormState } = useSignInForm()
    const { signIn } = useSignIn()

    function sendVerificationEmail() {
        try {
            void signIn!.prepareFirstFactor({
                emailAddressId: getEmailAddressId(),
                strategy: "email_link",
                redirectUrl: "http://localhost:3000/verification",
            })
        } catch (error) {
            handleVerificationError(error)
        }
    }

    function getEmailAddressId() {
        console.log("identifier:", signIn!.identifier)
        for (const factor of signIn!.supportedFirstFactors) {
            if (
                signIn!.identifier != null &&
                factor.strategy === "email_link" &&
                factor.safeIdentifier === signIn!.identifier
            ) {
                console.log("factor.emailAddressId: ", factor.emailAddressId)
                return factor.emailAddressId
            }
        }
        throw new Error("Email address id not found")
    }

    function handleVerificationError(error: unknown) {
        handleGenericError()
        setFormState("signIn")
    }

    return (
        <div>
            <p className="text-2xl font-bold">Verify your email</p>
            <p className="mt-2 text-base text-gray-700">
                to continue to Book Store
            </p>
            <div className="my-6 flex max-w-min items-center gap-4 rounded-md border-2 border-gray-100 bg-gray-50 p-1">
                <p className="overflow-x-hidden text-sm text-gray-700">
                    {signIn?.identifier}
                </p>
                <Button
                    variant={"ghost"}
                    className="p-0"
                    onClick={() => setFormState("signIn")}
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

export default VerifySignInForm
