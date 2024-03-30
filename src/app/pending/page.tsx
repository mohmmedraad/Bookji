import { type FC } from "react"
import { type Metadata } from "next"

interface pageProps {}
export const metadata: Metadata = {
    title: "Pending",
    description:
        "Your account activation is pending on Bookji. Please check your email for instructions on how to activate your account and access exclusive features.",
}

const page: FC<pageProps> = ({}) => {
    return <div>pending</div>
}

export default page
