"use client"

import { useEffect, useRef, type FC } from "react"
import { type Book as BookType } from "@/db/schema"
import { useIntersection } from "@mantine/hooks"
import { useQueryClient } from "@tanstack/react-query"
import { getQueryKey } from "@trpc/react-query"

import useShopSearch from "@/hooks/useShopSearch"
import Book from "@/components/ui/BookCover"
import { trpc } from "@/app/_trpc/client"

interface BooksFeedProps {
    initialBooks: (BookType & { userFullName: string | undefined })[]
    userId?: string
}

const BooksFeed: FC<BooksFeedProps> = ({ initialBooks, userId = "" }) => {
    const { category, coast, searchValue } = useShopSearch()
    const queryClient = useQueryClient()

    const lastPostRef = useRef<HTMLElement>(null)
    const { ref, entry } = useIntersection({
        root: lastPostRef.current,
        threshold: 1,
    })

    const { data, fetchNextPage } = trpc.getBooks.useInfiniteQuery(
        {
            limit: 10,
            searchBy: {
                category,
                coast,
                text: searchValue,
                userId,
            },
        },
        {
            // cacheTime: 0,
            // queryKey: [
            //     "getBooks",
            //     {
            //         limit: 10,
            //         searchBy: {
            //             category: "",
            //             coast: "free",
            //             text: "a",
            //             userId,
            //         },
            //     },
            // ],
            getNextPageParam: (lastPage, pages) =>
                lastPage?.length !== 0 ? pages.length : undefined,
            // @ts-expect-error TODO: Fix this
            initialData: { pages: [initialBooks], pageParams: [0] },
        }
    )

    useEffect(() => {
        const isIntersecting = entry?.isIntersecting
        console.log("isIntersecting: ", isIntersecting)
        if (isIntersecting) {
            void fetchNextPage()
        }
    }, [entry, fetchNextPage])

    useEffect(() => {
        console.log("queryKey", getQueryKey(trpc.getBooks))
        void queryClient.invalidateQueries(["getBooks"])
    }, [category, coast, searchValue, queryClient])

    console.log(data?.pages?.length)

    const books = data?.pages?.flatMap((page) => page)
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
