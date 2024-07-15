"use client"

import { type FC } from "react"
import type { ShopPageBook } from "@/types"

import { useBooksFeed } from "@/hooks/queries/useBooksFeed"
import BooksWrapper from "@/components/ui/books-wrapper"

import ShopBook from "../_components/ShopBook"
import ShopBookSkeleton from "../_components/ShopBookSkeleton"

interface BooksFeedProps {
    initialBooks: ShopPageBook[]
}

const BooksFeed: FC<BooksFeedProps> = ({ initialBooks }) => {
    const { books, ref, isFetching, isFetchingNextPage, isInitialLoading } =
        useBooksFeed(initialBooks)
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
                    {isFetching && !isInitialLoading && !isFetchingNextPage ? (
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
                                            author={book?.author || ""}
                                        />
                                    )
                                } else {
                                    return (
                                        <ShopBook
                                            key={book?.id}
                                            title={book?.title || ""}
                                            slug={book?.slug || ""}
                                            cover={book?.cover || ""}
                                            author={book?.author || ""}
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
