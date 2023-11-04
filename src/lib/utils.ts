import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import type { ClerkAPIError, ClerkErrorCode } from "@/types"
import {
    SignInFirstFactor,
    SignInResource,
    SignInStatus,
    SignUpResource,
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
    let errorMessage = error.errors[0].message
    if (errorCode === "session_exists")
        errorMessage = "You are already logged in."
    return { errorCode, errorMessage }
}

export function handleGenericError() {
    toast.error("Something went wrong. Please try again later.")
}

export function isAuthNotComplete(status: SignUpStatus | SignInStatus | null) {
    console.log("auth status: ", status)
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

export async function sendSignUpVerificationEmail(
    signUp: SignUpResource,
    websiteURL: string
) {
    const { startMagicLinkFlow, cancelMagicLinkFlow } =
        signUp.createMagicLinkFlow()
    await startMagicLinkFlow({
        redirectUrl: `${websiteURL}/verification`,
    })
}

export async function sendSignInVerificationEmail(
    signIn: SignInResource,
    websiteURL: string
) {
    const { startMagicLinkFlow, cancelMagicLinkFlow } =
        signIn.createMagicLinkFlow()
    await startMagicLinkFlow({
        emailAddressId: getEmailAddressId(signIn),
        redirectUrl: `${websiteURL}/verification`,
    })
}

export function handleSessionExistsError(
    errorMessage: string,
    router: AppRouterInstance
) {
    toast.error(errorMessage)
    /**
     * TODO: Redirect to the profile page or to page he was trying to access.
     */
    router.push("/")
}
