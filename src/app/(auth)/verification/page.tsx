"use client"

import React from "react"
import { isMagicLinkError, MagicLinkErrorCode, useClerk } from "@clerk/nextjs"

function Verification() {
    const { handleMagicLinkVerification } = useClerk()

    React.useEffect(() => {
        async function verify() {
            try {
                await handleMagicLinkVerification({
                    redirectUrl: "http://localhost:3000/pending",
                    redirectUrlComplete: "http://localhost:3000/",
                })
            } catch (err) {
                console.log(err)
            }
        }
        void verify()
    }, [])

    return null
}

export default Verification
