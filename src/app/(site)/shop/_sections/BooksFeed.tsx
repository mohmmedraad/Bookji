"use client"

import { useEffect, useRef, type FC } from "react"
import Link from "next/link"
import { type PartialBook } from "@/types"
import { useIntersection } from "@mantine/hooks"
import { Skeleton } from "@nextui-org/react"
import { useQueryClient } from "@tanstack/react-query"

import { useBooksSearchParam } from "@/hooks/useBooksSearchParams"
import { useIsMount } from "@/hooks/useIsMount"
import Book from "@/components/ui/BookCover"
import BooksWrapper from "@/components/ui/BooksWrapper"
import BookWrapper from "@/components/ui/BookWrapper"
import { trpc } from "@/app/_trpc/client"

interface ExtendedBooksType extends PartialBook {
    userFullName: string | undefined
}

interface BooksFeedProps {
    initialBooks: ExtendedBooksType[]
}

const BooksFeed: FC<BooksFeedProps> = ({ initialBooks }) => {
    const searchParams = useBooksSearchParam()
    const isMount = useIsMount()
    const queryClient = useQueryClient()

    const lastBookRef = useRef<HTMLElement>(null)
    const { ref, entry } = useIntersection({
        root: lastBookRef.current,
        threshold: 1,
    })

    const { data, isFetchingNextPage, fetchNextPage, isFetching } =
        trpc.getBooks.useInfiniteQuery(
            {
                ...searchParams,
                page: searchParams.page !== null ? +searchParams.page || 0 : 0,
            },
            {
                getNextPageParam: (lastPage, pages) =>
                    lastPage?.length !== 0 ? pages.length : undefined,
                // @ts-expect-error incorrect type
                initialData: { pages: [initialBooks], pageParams: [0] },
            }
        )

    useEffect(() => {
        const isIntersecting = entry?.isIntersecting
        if (isIntersecting) {
            void fetchNextPage()
        }
    }, [entry, fetchNextPage])

    useEffect(() => {
        if (!isMount) return

        void queryClient.resetQueries(["getBooks"])

        return () => {
            void queryClient.invalidateQueries(["getBooks"])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, queryClient])

    const books = data?.pages?.flatMap((page) => page)

    return (
        <BooksWrapper>
            {!isMount && !isFetching ? (
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
                                    className="text-center"
                                    ref={ref}
                                    key={book?.id}
                                >
                                    <Link href={`/book/${book?.slug}`}>
                                        <Book
                                            alt={`${book?.title}`}
                                            src={`${book?.cover}`}
                                            width={264}
                                            height={380}
                                            className="aspect-[2/3]"
                                        />
                                    </Link>
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
                                <div key={book?.id} className="text-center">
                                    <Link href={`/book/${book?.slug}`}>
                                        <Book
                                            alt={`${book?.title}`}
                                            src={`${book?.cover}`}
                                            width={264}
                                            height={380}
                                            className="aspect-[2/3]"
                                        />
                                    </Link>
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
