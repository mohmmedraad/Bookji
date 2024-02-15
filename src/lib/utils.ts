import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import type { ClerkAPIError, ClerkErrorCode } from "@/types"
import { type User } from "@clerk/nextjs/server"
import {
    type SignInResource,
    type SignInStatus,
    type SignUpResource,
    type SignUpStatus,
} from "@clerk/types"
import { clsx, type ClassValue } from "clsx"
import slugifyStr from "slugify"
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

export function getCurrentPageNumber(page: string | undefined) {
    return page === undefined ? 0 : Number(page) < 0 ? 0 : Number(page)
}

export function absoluteUrl(path: string) {
    // if (typeof window !== "undefined") return path
    console.log("NEXT_PUBLIC_VERCEL_URL: ", process.env.NEXT_PUBLIC_VERCEL_URL)
    if (process.env.NEXT_PUBLIC_VERCEL_URL)
        return `${process.env.NEXT_PUBLIC_VERCEL_URL}${path}`
    return `http://localhost:${process.env.PORT ?? 3000}${path}`
}

export function getRandomNumber(min: number, max: number) {
    // Generate a random number within the specified range
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export function slugify(str: string) {
    return slugifyStr(str, { lower: true })
}

export function formatDate(
    date: Date | string | number,
    options: Intl.DateTimeFormatOptions = {
        month: "long",
        day: "numeric",
        year: "numeric",
    }
) {
    return new Intl.DateTimeFormat("en-US", {
        ...options,
    }).format(new Date(date))
}

export function getUserEmail(user: User | null) {
    const email =
        user?.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)
            ?.emailAddress ?? ""

    return email
}
