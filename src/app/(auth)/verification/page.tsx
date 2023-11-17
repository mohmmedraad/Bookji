"use client"

import React from "react"
import { useSearchParams } from "next/navigation"
import { useClerk } from "@clerk/nextjs"

import { useWebsiteURL } from "@/hooks/useWebsiteURL"

type VerificationStatus = "loading" | "failed" | "expired" | "verified" | null

function Verification() {
    const [verificationStatus, setVerificationStatus] =
        React.useState<VerificationStatus>("loading")
    const searchParams = useSearchParams()
    const verificationLinkStatus = searchParams.get(
        "__clerk_status"
    ) as VerificationStatus

    const { handleMagicLinkVerification } = useClerk()
    const { websiteURL } = useWebsiteURL()
    React.useEffect(() => {
        async function verify() {
            try {
                if (verificationLinkStatus !== "verified") {
                    setVerificationStatus(verificationLinkStatus)
                    return
                }

                await handleMagicLinkVerification({
                    redirectUrl: `${websiteURL}/pending`,
                    redirectUrlComplete: `${websiteURL}`,
                })

                setVerificationStatus("verified")
            } catch (error) {
                handleMagicLinkVerificationError(error)
            }
        }
        void verify()

        function handleMagicLinkVerificationError(_: unknown) {
            setVerificationStatus("failed")
        }
    }, [websiteURL, handleMagicLinkVerification, verificationLinkStatus])

    if (verificationStatus === "loading") {
        return <div>Loading...</div>
    }

    if (verificationStatus === "verified") {
        return (
            <div>
                Successfully signed up. Return to the original tab to continue.
            </div>
        )
    }

    if (verificationStatus === "expired") {
        return <div>Magic link expired</div>
    }

    return <div>Magic link verification failed</div>
}

export default Verification
