import { type FC } from "react"

import { books } from "@/config/site"
import Container from "@/components/ui/Container"

import BooksFeed from "./_sections/BooksFeed"
import FilterBar from "./_sections/FilterBar"

const Page: FC = ({}) => {
    return (
        <main className="pb-8 pt-32">
            <Container>
                <FilterBar />
                {/**
                 * TODO: Add suspense
                 */}
                <BooksFeed initialBooks={books} />
            </Container>
        </main>
    )
}

export default Page
