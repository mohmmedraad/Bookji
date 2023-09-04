import { FC } from "react"
import { SignUp } from "@clerk/nextjs"

interface pageProps {}

const page: FC<pageProps> = ({}) => {
    return (
        <div>
            <SignUp />
        </div>
    )
}

export default page
