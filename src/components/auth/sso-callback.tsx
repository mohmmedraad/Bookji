"use client"

import * as React from "react"
import { useClerk } from "@clerk/nextjs"

import { type SSOCallbackPageProps } from "@/app/(auth)/sso-callback/page"

export default function SSOCallback({ searchParams }: SSOCallbackPageProps) {
    const { handleRedirectCallback } = useClerk()

    React.useEffect(() => {
        void handleRedirectCallback(searchParams)
    }, [searchParams, handleRedirectCallback])

    return (
        <div
            role="status"
            aria-label="Loading"
            aria-describedby="loading-description"
            className="flex items-center justify-center"
        >
            loading
        </div>
    )
}
