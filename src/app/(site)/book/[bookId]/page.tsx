import { type FC } from "react"
import { notFound } from "next/navigation"
import { db } from "@/db"

import BookPage from "./_sections/BookPage"

interface pageProps {
    params: {
        bookId: string
    }
}

const Page: FC<pageProps> = async ({ params: { bookId } }) => {
    const book = await db.query.books.findFirst({
        columns: {
            id: true,
            userId: true,
            cover: true,
            description: true,
            title: true,
            price: true,
        },
        where: (book, { eq }) => eq(book.id, +bookId),
    })

    if (!book) {
        return notFound()
    }

    return (
        <section className="overflow-x-clip">
            <BookPage {...book} />
        </section>
    )
}

export default Page
