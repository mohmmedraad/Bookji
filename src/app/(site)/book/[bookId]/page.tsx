import { type FC } from "react"
import { notFound } from "next/navigation"
import { db } from "@/db"

import Book from "@/components/ui/BookCover"
import Container from "@/components/ui/Container"
import { Icons } from "@/components/Icons"

import BookInfo from "./_sections/BookInfo"

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
        },
        where: (book, { eq }) => eq(book.id, +bookId),
    })

    if (!book) {
        return notFound()
    }

    return (
        <section className="overflow-x-hidden">
            <Container className="grid gap-48 pt-40 lg:grid-cols-2 lg:gap-14 xl:grid-cols-bookPage xl:justify-between">
                <div className="grid h-[100vh] items-start justify-center lg:block">
                    <div className="sticky top-14">
                        <Book
                            alt="book cover"
                            className="h-[340px] w-[230px] sm:h-[420px] sm:w-[280px]"
                            width={240}
                            height={420}
                            src={book.cover!}
                            priority={true}
                            loading="eager"
                        />
                        <Icons.Polygon className="absolute top-0 z-[-1] translate-x-[-35%] translate-y-[-14%] rotate-[-23.97deg] text-[#32166D]" />
                        <Icons.Polygon className="absolute bottom-0 z-[-1] translate-x-[12%] translate-y-[26%] rotate-[62.75deg] text-[#F97316]" />
                    </div>
                </div>

                <BookInfo
                    id={book.id}
                    userId={book.userId}
                    title={book.title}
                    description={book.description}
                    bookId={bookId}
                />

                <div className="hidden h-[100vh] bg-green-600 xl:block"></div>
            </Container>
        </section>
    )
}

export default Page
