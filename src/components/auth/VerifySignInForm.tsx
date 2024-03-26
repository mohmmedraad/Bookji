"use client"

import { type FC } from "react"
import { useRouter } from "next/navigation"
import useSignInForm from "@/store/useSignInForm"
import { isClerkAPIResponseError, useSignIn } from "@clerk/nextjs"
import { PenSquare } from "lucide-react"
import { toast } from "sonner"

import { handleGenericError } from "@/lib/utils"
import {
    clerkError,
    handleSessionExistsError,
    sendSignInVerificationEmail,
} from "@/lib/utils/auth"
import useCount from "@/hooks/useCount"
import { useWebsiteURL } from "@/hooks/useWebsiteURL"

import { Button } from "../ui/Button"

const VerifySignInForm: FC = () => {
    const { countdownTime, restartCountdown } = useCount({
        initialCountdownTime: 10,
    })
    const { setFormState } = useSignInForm()
    const { signIn } = useSignIn()
    const { websiteURL } = useWebsiteURL()
    const router = useRouter()

    async function handleResendEmail() {
        try {
            restartCountdown()
            await sendSignInVerificationEmail(signIn!, websiteURL!)
        } catch (error) {
            handleVerificationError(error)
        }
    }

    function handleVerificationError(error: unknown) {
        if (!isClerkAPIResponseError(error)) return handleGenericError()
        const { errorCode, errorMessage } = clerkError(error)

        if (errorCode === "session_exists")
            return handleSessionExistsError(errorMessage, router)

        if (errorCode === "form_identifier_not_found")
            return handleEmailNotExistsError(errorMessage)

        return handleGenericError()
    }

    function handleEmailNotExistsError(message: string) {
        toast.error(message)
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
                    void handleResendEmail()
                }}
            >
                Didn&apos;t receive a link? Resend{" "}
                {countdownTime != 0 && `(${countdownTime})`}
            </button>
        </div>
    )
}

export default VerifySignInForm
