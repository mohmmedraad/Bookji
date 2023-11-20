import { type FC } from "react"
import { db } from "@/db"
import { withUsers } from "@/server"
import { asc, like } from "drizzle-orm"
import { Book } from "lucide-react"

import { books } from "@/config/site"
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
    // const searchBy = "Al"
    // const books = await db.query.books.findMany({
    //     limit: 10,
    //     offset: 0,
    //     where: (Book) => like(Book.title, `%${searchBy}%`),
    //     orderBy: (book) => [asc(book.createdAt)],
    // })

    // console.log("book Alone:", books)
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
