import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import type { ClerkAPIError, ClerkErrorCode, SearchParams } from "@/types"
import { type User } from "@clerk/nextjs/server"
import {
    type SignInResource,
    type SignInStatus,
    type SignUpResource,
    type SignUpStatus,
} from "@clerk/types"
import { toast } from "sonner"

export function clerkError(error: ClerkAPIError) {
    const errorCode = error.errors[0].code as ClerkErrorCode
    let errorMessage = error.errors[0].message
    if (errorCode === "session_exists")
        errorMessage = "You are already logged in."
    return { errorCode, errorMessage }
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
    const { startMagicLinkFlow } = signUp.createMagicLinkFlow()
    await startMagicLinkFlow({
        redirectUrl: `${websiteURL}/verification`,
    })
}

export async function sendSignInVerificationEmail(
    signIn: SignInResource,
    websiteURL: string
) {
    const { startMagicLinkFlow } = signIn.createMagicLinkFlow()
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

export function getUserEmail(user: User | null) {
    const email =
        user?.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)
            ?.emailAddress ?? ""

    return email
}
