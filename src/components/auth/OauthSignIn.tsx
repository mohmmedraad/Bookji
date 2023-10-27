"use client"

import { useState } from "react"
import { isClerkAPIResponseError, useSignIn } from "@clerk/nextjs"
import { type OAuthStrategy } from "@clerk/types"
import { toast } from "sonner"

import { Icons } from "../Icons"
import { Button } from "../ui/Button"

type OauthProvider = {
    name: string
    icon: keyof typeof Icons
    strategy: OAuthStrategy
}[]

const oauthProviders: OauthProvider = [
    { name: "Google", strategy: "oauth_google", icon: "Google" },
    { name: "Facebook", strategy: "oauth_facebook", icon: "Facebook" },
    { name: "Apple", strategy: "oauth_apple", icon: "Apple" },
]

const OauthSignIn = () => {
    const [isLoading, setIsLoading] = useState<OAuthStrategy | null>(null)
    const { signIn, isLoaded: signInLoaded } = useSignIn()

    async function oauthSignIn(provider: OAuthStrategy) {
        if (!signInLoaded) return null
        try {
            setIsLoading(provider)
            await authenticate(provider)
        } catch (error) {
            setIsLoading(null)
            handleSignInError(error)
        }
    }

    async function authenticate(provider: OAuthStrategy) {
        await signIn!.authenticateWithRedirect({
            strategy: provider,
            redirectUrl: "/sso-callback",
            redirectUrlComplete: "/",
        })
    }

    function handleSignInError(error: unknown) {
        const unknownError = "Something went wrong, please try again."

        isClerkAPIResponseError(error)
            ? toast.error(error.errors[0]?.longMessage ?? unknownError)
            : toast.error(unknownError)
    }

    return (
        <div className="my-6 grid grid-cols-3 gap-3">
            {oauthProviders.map((provider) => {
                const Icon = Icons[provider.icon]
                return (
                    <Button
                        aria-label={`Sign in with ${provider.name}`}
                        key={provider.strategy}
                        variant="outline"
                        className="h-auto w-full bg-background py-3 sm:w-auto"
                        onClick={() => void oauthSignIn(provider.strategy)}
                        disabled={isLoading !== null}
                    >
                        {<Icon className="h-6 w-6" aria-hidden="true" />}
                    </Button>
                )
            })}
        </div>
    )
}

export default OauthSignIn
