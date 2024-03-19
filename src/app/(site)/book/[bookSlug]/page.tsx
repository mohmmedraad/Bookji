import { type FC } from "react"
import { notFound } from "next/navigation"
import { db } from "@/db"

import Book from "@/components/ui/BookCover"
import Container from "@/components/ui/Container"
import BookProvider from "@/components/BookProvider"
import { Icons } from "@/components/Icons"

import BookInfo from "./_sections/BookInfo"
import UserBooks from "./_sections/StoresBooks"

interface pageProps {
    params: {
        bookSlug: string
    }
}

const Page: FC<pageProps> = async ({ params: { bookSlug } }) => {
    const book = await db.query.books.findFirst({
        columns: {
            author: true,
            id: true,
            userId: true,
            cover: true,
            description: true,
            title: true,
            price: true,
            storeId: true,
            slug: true,
        },
        where: (book, { eq }) => eq(book.slug, bookSlug),
    })

    if (!book) {
        return notFound()
    }

    return (
        <section className="overflow-x-clip">
            <BookProvider {...book} />
            <Container className="grid gap-48 pt-40 md:grid-cols-2 lg:gap-14 xl:grid-cols-bookPage xl:justify-between">
                <div className="grid items-start justify-center lg:block">
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
                    userId={book.userId}
                    title={book.title}
                    description={book.description}
                />

                <div className="hidden xl:block">
                    <h4 className="mb-8 text-sm font-bold text-gray-900">
                        BOOKS BY THIS AUTHOR
                    </h4>
                    <div className="sticky top-14 h-[calc(100vh-160px)] ">
                        <UserBooks />
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default Page
