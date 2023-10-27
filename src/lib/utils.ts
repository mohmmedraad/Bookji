import type { ClerkAPIError, ClerkErrorCode } from "@/types"
import {
    SignInFirstFactor,
    SignInResource,
    SignInStatus,
    SignUpStatus,
} from "@clerk/types"
import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function clerkError(error: ClerkAPIError) {
    const errorCode = error.errors[0].code as ClerkErrorCode
    const errorMessage = error.errors[0].message
    return { errorCode, errorMessage }
}

export function handleGenericError() {
    toast.error("Something went wrong. Please try again later.")
}

export function isAuthNotComplete(status: SignUpStatus | SignInStatus | null) {
    return !status || status !== "complete"
}

export function getEmailAddressId(signIn: SignInResource) {
    for (const factor of signIn.supportedFirstFactors) {
        if (
            factor.strategy === "email_link" &&
            factor.safeIdentifier === signIn.identifier
        )
            return factor.emailAddressId
    }
    throw new Error("Email address id not found.")
}
