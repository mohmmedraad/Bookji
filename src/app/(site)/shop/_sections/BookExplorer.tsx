"use client"

import { useState, type FC } from "react"
import { type PartialBook } from "@/types"

import { type SearchParams } from "@/lib/validations/book"
import useDebounce from "@/hooks/useDebounce"

import BooksFeed from "./BooksFeed"
import FilterBar from "./FilterBar"

interface BookExplorerProps {
    initialBooks: (PartialBook & { userFullName: string | undefined })[]
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
    const searchParamsValue = useDebounce(searchParams, 700)
    return (
        <>
            <FilterBar
                onSearchParamsChange={(params) =>
                    setSearchParams({ ...params, userId })
                }
            />
            <BooksFeed
                initialBooks={initialBooks}
                searchParams={searchParamsValue}
            />
        </>
    )
}

export default BookExplorer
