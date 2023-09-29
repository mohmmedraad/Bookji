import { type FC } from "react"

import { Button } from "@/components/ui/Button"
import Container from "@/components/ui/Container"

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
                    <h2 className="text-[2.5rem] font-bold leading-none tracking-tighter text-accentForeground md:text-5xl">
                        Become one of our authors
                    </h2>
                    <p className="mb-6 mt-4 max-w-lg text-base text-gray-500">
                        we started this business sice 1934, in that year there
                        was no online sale...
                    </p>
                    <Button>join as author</Button>
                </div>
            </Container>
        </section>
    )
}

export default JoinUs
