"use client"

import { useState, type FC } from "react"
import { type Book as BookType } from "@/db/schema"

import { type SearchParams } from "@/lib/validations/book"

import BooksFeed from "./BooksFeed"
import FilterBar from "./FilterBar"

interface BookExplorerProps {
    initialBooks: (BookType & { userFullName: string | undefined })[]
    userId?: string
}

const BookExplorer: FC<BookExplorerProps> = ({ initialBooks, userId = "" }) => {
    const [searchParams, setSearchParams] = useState<SearchParams>({
        userId: "",
        categories: [],
        cost: {
            min: 0,
            max: 500,
        },
        text: "",
    })
    return (
        <>
            <FilterBar
                onSearchParamsChange={(params) =>
                    setSearchParams({ ...params, userId })
                }
            />
            <BooksFeed
                initialBooks={initialBooks}
                searchParams={searchParams}
            />
        </>
    )
}

export default BookExplorer
