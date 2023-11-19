"use client"

import { useEffect, useRef, type FC } from "react"
import { type Book as BookType } from "@/db/schema"
import { useIntersection } from "@mantine/hooks"
import { useInfiniteQuery } from "@tanstack/react-query"
import { TRPCError } from "@trpc/server"

import useShopSearch from "@/hooks/useShopSearch"
import Book from "@/components/ui/BookCover"
import { trpc } from "@/app/_trpc/client"

interface BooksFeedProps {
    initialBooks: {
        id: number
        userId: string
        title: string
        description: string | null
        cover: string | null
        price: string
        tag: string[] | null
        inventory: number
        createdAt: Date | null
        updatedAt: Date | null
        userFullName: string // Additional property
    }[]
}

const BooksFeed: FC<BooksFeedProps> = ({ initialBooks }) => {
    const { category, coast, searchValue } = useShopSearch()
    const lastPostRef = useRef<HTMLElement>(null)
    const { ref, entry } = useIntersection({
        root: lastPostRef.current,
        threshold: 1,
    })

    const { data, fetchNextPage } = trpc.getBooks.useInfiniteQuery(
        {
            limit: 10,
            searchBy: null,
            searchInput: null,
        },
        {
            // queryKey: ["getBooks", "infinite"],
            getNextPageParam: (lastPage, pages) => pages.length + 1,
            // @ts-expect-error invalid type
            initialData: initialBooks,
            initialCursor: 0,
        }
    )

    useEffect(() => {
        const isIntersecting = entry?.isIntersecting
        if (isIntersecting) {
            void fetchNextPage()
        }
    }, [entry, fetchNextPage])
    console.log(data?.pages)

    const books = data?.pages?.flatMap((page) => page) || initialBooks
    return (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {books?.map((book, index) => {
                const isLastBook = index === books.length - 1
                if (isLastBook) {
                    // Add a ref to the last post in the list
                    return (
                        <div
                            key={book?.title}
                            className="text-center"
                            ref={ref}
                        >
                            <Book
                                alt={`${book?.title}`}
                                src={`${book?.cover}`}
                                width={264}
                                height={380}
                                className="aspect-[2/3]"
                            />
                            <h3 className="mt-2 text-sm font-semibold">
                                {book?.title}
                            </h3>
                            <h4 className="mt-2 text-xs text-gray-500">
                                {book?.userFullName}
                            </h4>
                        </div>
                    )
                } else {
                    return (
                        <div key={book?.title} className="text-center">
                            <Book
                                alt={`${book?.title}`}
                                src={`${book?.cover}`}
                                width={264}
                                height={380}
                                className="aspect-[2/3]"
                            />
                            <h3 className="mt-2 text-sm font-semibold">
                                {book?.title}
                            </h3>
                            <h4 className="mt-2 text-xs text-gray-500">
                                {book?.userFullName}
                            </h4>
                        </div>
                    )
                }
            })}
            {/**
             * TODO: Add a loading indicator
             */}
        </div>
    )
}

export default BooksFeed
