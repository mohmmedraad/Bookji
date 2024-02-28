import { type FC } from "react"
import Image from "next/image"

import Container from "@/components/ui/Container"
import SignUp from "@/components/auth/SignUp"

interface pageProps {
    searchParams: {
        _origin: string | undefined
    }
}

const page: FC<pageProps> = ({ searchParams }) => {
    const origin = searchParams?._origin

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
