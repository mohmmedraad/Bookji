"use client"

import { type FC } from "react"

import useBook, { type BookType } from "@/hooks/useBook"
import Book from "@/components/ui/BookCover"
import Container from "@/components/ui/Container"
import { Icons } from "@/components/Icons"

import BookInfo from "./BookInfo"
import UserBooks from "./UserBooks"

const BookPage: FC<BookType> = ({
    id,
    userId,
    title,
    description,
    cover,
    price,
}) => {
    const setBook = useBook((state) => state.setBook)
    setBook({ id, userId, title, description, cover, price })
    return (
        <Container className="grid gap-48 pt-40 md:grid-cols-2 lg:gap-14 xl:grid-cols-bookPage xl:justify-between">
            <div className="grid items-start justify-center lg:block">
                <div className="sticky top-14">
                    <Book
                        alt="book cover"
                        className="h-[340px] w-[230px] sm:h-[420px] sm:w-[280px]"
                        width={240}
                        height={420}
                        src={cover!}
                        priority={true}
                        loading="eager"
                    />
                    <Icons.Polygon className="absolute top-0 z-[-1] translate-x-[-35%] translate-y-[-14%] rotate-[-23.97deg] text-[#32166D]" />
                    <Icons.Polygon className="absolute bottom-0 z-[-1] translate-x-[12%] translate-y-[26%] rotate-[62.75deg] text-[#F97316]" />
                </div>
            </div>

            <BookInfo
                id={id}
                userId={userId}
                title={title}
                description={description}
                bookId={id.toString()}
            />

            <div className="hidden xl:block">
                <h4 className="mb-8 text-sm font-bold text-gray-900">
                    BOOKS BY THIS AUTHOR
                </h4>
                <div className="sticky top-14 h-[calc(100vh-160px)] ">
                    <UserBooks userId={userId} bookId={id} />
                </div>
            </div>
        </Container>
    )
}

export default BookPage
