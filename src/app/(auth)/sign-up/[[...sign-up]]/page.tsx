import { type FC } from "react"
import { type Metadata } from "next"
import Image from "next/image"
import { redirect } from "next/navigation"

import { getCachedUser } from "@/lib/utils/cachedResources"
import Container from "@/components/ui/container"
import SignUp from "@/components/auth/SignUp"

interface pageProps {
    searchParams: {
        _origin: string | undefined
    }
}

export const metadata: Metadata = {
    title: "Sign-in",
    description:
        "Sign up and create your account on Bookji to enjoy exclusive offers, personalized recommendations, and seamless book shopping.",
}

const page: FC<pageProps> = async ({ searchParams }) => {
    const user = await getCachedUser()
    const origin = searchParams?._origin
    if (user) {
        return redirect(`${origin || "/"}`)
    }

    return (
        <Container className="grid min-h-screen items-center justify-center gap-32 py-10 lg:grid-cols-2 ">
            <Image
                width={646}
                height={804}
                src={"/img-6.webp"}
                alt="sign in image"
                loading="eager"
                className="hidden h-[50.25rem] w-full rounded-3xl lg:block"
            />
            <SignUp origin={origin} />
        </Container>
    )
}

export default page
