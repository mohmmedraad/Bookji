import React from "react"
import { Metadata } from "next"

import Verification from "./_components/Verification"

export const metadata: Metadata = {
    title: "Verification",
    description:
        "Verify your account for added security on Bookji. Follow the verification process to access exclusive features and benefits.",
}

function page() {
    ;<Verification />
}

export default page
