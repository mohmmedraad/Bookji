import { type FC } from "react"
import { type Metadata } from "next"

import Verification from "./_components/Verification"

export const metadata: Metadata = {
    title: "Verification",
    description:
        "Verify your account for added security on Bookji. Follow the verification process to access exclusive features and benefits.",
}

interface pageProps {}
const page: FC<pageProps> = ({}) => {
    return <Verification />
}

export default page
