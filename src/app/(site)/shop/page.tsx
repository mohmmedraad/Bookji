import { type FC } from "react"
import { db } from "@/db"
import { withUsers } from "@/server"
import { asc } from "drizzle-orm"

import Container from "@/components/ui/Container"

import BookExplorer from "./_sections/BookExplorer"

const Page: FC = async ({}) => {
    const books = await db.query.books.findMany({
        limit: 10,
        offset: 0,
        columns: {
            userId: true,
            cover: true,
            id: true,
            title: true,
        },
        orderBy: (book) => [asc(book.createdAt)],
    })

    const initialBooks = await withUsers(books)
    return (
        <main className="pb-8 pt-32">
            <Container>
                <BookExplorer initialBooks={initialBooks} />

                {/**
                 * TODO: Add suspense
                 */}
                {/* <BooksFeed initialBooks={initialBooks} /> */}
            </Container>
        </main>
    )
}

export default Page
