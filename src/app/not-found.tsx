import { type FC } from "react"
import { type Metadata } from "next"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/Button"
import Container from "@/components/ui/Container"
import GoBackButton from "@/components/ui/GoBackButton"
import { Icons } from "@/components/Icons"

interface NotFoundProps {}

export const metadata: Metadata = {
    title: "Page Not Found",
    description: "Page not found",
}

const NotFound: FC<NotFoundProps> = ({}) => {
    return (
        <Container className="flex min-h-screen flex-col-reverse items-center justify-between gap-6 lg:flex-row">
            <div className="text-center lg:text-start">
                <p className="text-6xl font-semibold text-gray-900">
                    Oops! Page not found
                </p>
                <p className="mt-8 text-xl text-gray-800">
                    Something went wrong. It&apos;s look that your requested
                    could not be found. It&apos;s look like the link is broken
                    or the page is removed.
                </p>
                <div className="mt-12 flex justify-center gap-4 lg:justify-start">
                    <GoBackButton className="flex gap-3">
                        <ArrowLeft className="h-6 w-6" />
                        Go back
                    </GoBackButton>
                    <Button variant={"outline"}>Home</Button>
                </div>
            </div>

            <Icons.NOtFound className="h-52 w-full sm:h-[600px]" />
        </Container>
    )
}

export default NotFound
