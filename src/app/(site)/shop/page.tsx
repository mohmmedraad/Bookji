import { type FC } from "react"
import { db } from "@/db"
import { withUsers } from "@/server"
import { asc } from "drizzle-orm"

import Container from "@/components/ui/Container"

import BooksFeed from "./_sections/BooksFeed"
import FilterBar from "./_sections/FilterBar"

const Page: FC = async ({}) => {
    const books = await db.query.books.findMany({
        limit: 10,
        offset: 0,
        orderBy: (book) => [asc(book.createdAt)],
    })

    const initialBooks = await withUsers(books)
    return (
        <main className="pb-8 pt-32">
            <Container>
                <FilterBar />
                {/**
                 * TODO: Add suspense
                 */}
                <BooksFeed initialBooks={initialBooks} />
            </Container>
        </main>
    )
}

export default Page
