import { type FC } from "react"

import { books } from "@/config/site"
import Container from "@/components/ui/container"
import BookCarousel from "@/components/BookCarousel"

const BestBook: FC = ({}) => {
    return (
        <section about="Best Book" className="py-20">
            <Container>
                <p className="mb-2 text-sm text-primary">
                    Great collection for all{" "}
                </p>
                <h2 className="text-[2.5rem] font-bold leading-none tracking-tighter text-accent-foreground md:text-5xl">
                    The Best Books
                </h2>
            </Container>
            <BookCarousel items={books} />
        </section>
    )
}

export default BestBook
