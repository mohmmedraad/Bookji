"use client"

import { useEffect, useRef, useState, type FC } from "react"
import { type Book as BookType } from "@/db/schema"
import { type PartialBook } from "@/types"
import { useIntersection, usePrevious } from "@mantine/hooks"
import { Skeleton } from "@nextui-org/react"
import { useQueryClient } from "@tanstack/react-query"

import { type SearchParams } from "@/lib/validations/book"
import Book from "@/components/ui/BookCover"
import BooksWrapper from "@/components/ui/BooksWrapper"
import BookWrapper from "@/components/ui/BookWrapper"
import { trpc } from "@/app/_trpc/client"

interface ExtendedBooksType extends PartialBook {
    userFullName: string | undefined
}

interface BooksFeedProps {
    initialBooks: ExtendedBooksType[]
    searchParams: SearchParams
}

const BooksFeed: FC<BooksFeedProps> = ({
    initialBooks,
    searchParams: { userId = "", categories, cost, text },
}) => {
    const previousValue = usePrevious(text)
    const previousCategories = usePrevious(categories)
    const [isFetchingWithSearch, setIsFetchingWithSearch] = useState(false)
    const queryClient = useQueryClient()

    const lastPostRef = useRef<HTMLElement>(null)
    const { ref, entry } = useIntersection({
        root: lastPostRef.current,
        threshold: 1,
    })

    const {
        data,
        isFetchingNextPage,
        fetchNextPage,
        isFetchedAfterMount,
        isFetching,
    } = trpc.getBooks.useInfiniteQuery(
        {
            limit: 10,
            searchParams: {
                categories,
                cost,
                text,
                userId,
            },
        },
        {
            getNextPageParam: (lastPage, pages) =>
                lastPage?.length !== 0 ? pages.length : undefined,
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

    console.log("isFetching: ", isFetching)
    console.log("isFetchingNextPage: ", isFetchingNextPage)
    console.log("isFetchedAfterMount: ", isFetchedAfterMount)

    useEffect(() => {
        console.log(text)
        void queryClient.resetQueries(["getBooks"])
        setIsFetchingWithSearch(
            !!text ||
                !!previousValue ||
                !!categories.length ||
                !!previousCategories?.length
        )

        return () => {
            setIsFetchingWithSearch(true)
            void queryClient.invalidateQueries(["getBooks"])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categories, cost, text, queryClient])

    const books = data?.pages?.flatMap((page) => page)
    return (
        <BooksWrapper>
            {isFetching && !isFetchedAfterMount && isFetchingWithSearch ? (
                new Array(10).fill(0).map((_, index) => (
                    <div className="text-center" key={index}>
                        <BookWrapper className="text-center">
                            <Skeleton className="aspect-[2/3]" />
                        </BookWrapper>
                        <Skeleton className="mx-auto mt-2 h-[1em] w-[50%] rounded-sm"></Skeleton>
                        <Skeleton className="mx-auto mt-2 h-[.8em] w-[70%] rounded-sm"></Skeleton>
                    </div>
                ))
            ) : (
                <>
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
                    {isFetchingNextPage
                        ? new Array(10).fill(0).map((_, index) => (
                              <div className="text-center" key={index}>
                                  <BookWrapper className="text-center">
                                      <Skeleton className="aspect-[2/3]" />
                                  </BookWrapper>
                                  <Skeleton className="mx-auto mt-2 h-[1em] w-[50%] rounded-sm"></Skeleton>
                                  <Skeleton className="mx-auto mt-2 h-[.8em] w-[70%] rounded-sm"></Skeleton>
                              </div>
                          ))
                        : null}
                </>
            )}
        </BooksWrapper>
    )
}

export default BooksFeed
