"use client"

import { type FC } from "react"
import { useRouter } from "next/navigation"
import useSignUpForm from "@/store/useSignUpForm"
import { isClerkAPIResponseError, useSignUp } from "@clerk/nextjs"
import { PenSquare } from "lucide-react"
import { toast } from "sonner"

import { handleGenericError } from "@/lib/utils"
import {
    clerkError,
    handleSessionExistsError,
    sendSignUpVerificationEmail,
} from "@/lib/utils/auth"
import useCount from "@/hooks/useCount"
import { useWebsiteURL } from "@/hooks/useWebsiteURL"

import { Button } from "../ui/button"

const VerifySignUpForm: FC = () => {
    const { countdownTime, restartCountdown } = useCount({
        initialCountdownTime: 10,
    })
    const { setFormState, emailAddress } = useSignUpForm()
    const { signUp } = useSignUp()
    const { websiteURL } = useWebsiteURL()
    const router = useRouter()

    async function handleResendEmail() {
        try {
            restartCountdown()
            await sendSignUpVerificationEmail(signUp!, websiteURL!)
        } catch (error) {
            handleVerificationError(error)
        }
    }

    function handleVerificationError(error: unknown) {
        if (!isClerkAPIResponseError(error)) return handleGenericError()
        const { errorCode, errorMessage } = clerkError(error)

        if (errorCode === "session_exists")
            return handleSessionExistsError(errorMessage, router)

        if (errorCode === "form_identifier_exists")
            return handleEmailExistsError(errorMessage)

        return handleGenericError()
    }

    function handleEmailExistsError(message: string) {
        toast.error(message)
        setFormState("signUp")
    }

    return (
        <div>
            <p className="text-2xl font-bold">Verify your email</p>
            <p className="mt-2 text-base text-gray-700">
                to continue to Book Store
            </p>
            <div className="my-6 flex max-w-min items-center gap-4 rounded-md border-2 border-gray-100 bg-gray-50 p-1">
                <p className="text-sm text-gray-700">{emailAddress}</p>
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
                onClick={() => void handleResendEmail()}
            >
                Didn&apos;t receive a link? Resend{" "}
                {countdownTime != 0 && `(${countdownTime})`}
            </button>
        </div>
    )
}

export default VerifySignUpForm
