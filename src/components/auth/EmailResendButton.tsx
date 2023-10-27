"use client"

import type { FC } from "react"

import useSignUpForm from "@/hooks/useSignUpForm"

const EmailResendButton: FC = ({}) => {
    const { emailResendCountdown, startEmailResendCountdown } = useSignUpForm()
    return (
        <button
            className="text-primary disabled:text-pink-400"
            disabled={emailResendCountdown > 0}
            onClick={() => {
                startEmailResendCountdown()
            }}
        >
            Didn&apos;t receive a link? Resend{" "}
            {emailResendCountdown != 0 && `(${emailResendCountdown})`}
        </button>
    )
}

export default EmailResendButton
