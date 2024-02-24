"use client"

import { useEffect, useRef, type FC } from "react"
import { type PartialBook } from "@/types"
import { useIntersection } from "@mantine/hooks"

import { useBooksFeed } from "@/hooks/useBooksFeed"
import { useBooksSearchParam } from "@/hooks/useBooksSearchParams"
import { useIsMount } from "@/hooks/useIsMount"
import BooksWrapper from "@/components/ui/BooksWrapper"
import { trpc } from "@/app/_trpc/client"

import ShopBook from "../_components/ShopBook"
import ShopBookSkeleton from "../_components/ShopBookSkeleton"

interface ExtendedBooksType extends PartialBook {
    userFullName: string | undefined
}

interface BooksFeedProps {
    initialBooks: ExtendedBooksType[]
}

const BooksFeed: FC<BooksFeedProps> = ({ initialBooks }) => {
    const { books, ref, isFetching, isFetchingNextPage, isMount } =
        useBooksFeed(initialBooks)
    // const searchParams = useBooksSearchParam()
    // const isMount = useIsMount()

    // const lastBookRef = useRef<HTMLElement>(null)
    // const { ref, entry } = useIntersection({
    //     root: lastBookRef.current,
    //     threshold: 1,
    // })

    // const { data, isFetchingNextPage, fetchNextPage, isFetching } =
    //     trpc.getBooks.useInfiniteQuery(
    //         {
    //             ...searchParams,
    //             page: searchParams.page !== null ? +searchParams.page || 0 : 0,
    //         },
    //         {
    //             getNextPageParam: (lastPage, pages) =>
    //                 lastPage?.length !== 0 ? pages.length : undefined,
    //             // @ts-expect-error incorrect type
    //             initialData: { pages: [initialBooks], pageParams: [0] },
    //         }
    //     )

    // useEffect(() => {
    //     const isIntersecting = entry?.isIntersecting
    //     if (isIntersecting) {
    //         void fetchNextPage()
    //     }
    // }, [entry, fetchNextPage])

    // const books = data?.pages?.flatMap((page) => page)

    return (
        <>
            {books?.length === 0 && !isFetching ? (
                <div className="mt-40 flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-bold md:text-4xl">
                        NO BOOKS FOUND
                    </h2>
                    <p className="mb-6 mt-4 max-w-md">
                        Try to change your search parameters
                    </p>
                </div>
            ) : (
                <BooksWrapper>
                    {isMount && isFetching && !isFetchingNextPage ? (
                        new Array(10)
                            .fill(0)
                            .map((_, index) => <ShopBookSkeleton key={index} />)
                    ) : (
                        <>
                            {books?.map((book, index) => {
                                const isLastBook = index === books.length - 1
                                if (isLastBook) {
                                    // Add a ref to the last post in the list
                                    return (
                                        <ShopBook
                                            key={book?.id}
                                            // @ts-expect-error incorrect type
                                            ref={ref}
                                            title={book?.title || ""}
                                            slug={book?.slug || ""}
                                            cover={book?.cover || ""}
                                            userFullName={
                                                book?.userFullName || ""
                                            }
                                        />
                                    )
                                } else {
                                    return (
                                        <ShopBook
                                            key={book?.id}
                                            title={book?.title || ""}
                                            slug={book?.slug || ""}
                                            cover={book?.cover || ""}
                                            userFullName={
                                                book?.userFullName || ""
                                            }
                                        />
                                    )
                                }
                            })}
                            {isFetchingNextPage
                                ? new Array(10)
                                      .fill(0)
                                      .map((_, index) => (
                                          <ShopBookSkeleton key={index} />
                                      ))
                                : null}
                        </>
                    )}
                </BooksWrapper>
            )}
        </>
    )
}

export default BooksFeed
