import { type FC } from "react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import Container from "@/components/ui/container"

interface JoinUsProps {}

const JoinUs: FC<JoinUsProps> = ({}) => {
    return (
        <section
            about="join us"
            className="relative overflow-x-hidden py-56 xl:pt-0"
        >
            <Container className="relative flex items-center justify-center">
                <div className="max-w-lg text-center">
                    <p className="mb-2 text-sm text-primary">Join Us</p>
                    <h2 className="text-[2.5rem] font-bold leading-none tracking-tighter text-accent-foreground md:text-5xl">
                        Become one of our members
                    </h2>
                    <p className="mb-6 mt-4 max-w-lg text-base text-gray-500">
                        We started this business in 1934. In that year, there
                        were no online sales...
                    </p>
                    <Link href="/sign-up" className={buttonVariants()}>
                        Join Bookji For Free
                    </Link>
                </div>
            </Container>
        </section>
    )
}

export default JoinUs
