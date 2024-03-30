import { type Metadata } from "next"
import { type HandleOAuthCallbackParams } from "@clerk/types"

import SSOCallback from "@/components/auth/sso-callback"

export interface SSOCallbackPageProps {
    searchParams: HandleOAuthCallbackParams
}

export const metadata: Metadata = {
    title: "SSO-CALLBACK",
    description:
        "Experience seamless authentication with Bookji's Single Sign-On (SSO) callback. Streamline access to your account and enjoy hassle-free login.",
}

export default function SSOCallbackPage({
    searchParams,
}: SSOCallbackPageProps) {
    return <SSOCallback searchParams={searchParams} />
}
