"use client"

import { type FC } from "react"
import { type PartialBook } from "@/types"

import BooksFeed from "./BooksFeed"
import FilterBar from "./FilterBar"

interface BookExplorerProps {
    initialBooks: (PartialBook & { userFullName: string | undefined })[]
    userId?: string
}

const BookExplorer: FC<BookExplorerProps> = ({ initialBooks, userId = "" }) => {
    return (
        <>
            <FilterBar />
            <BooksFeed initialBooks={initialBooks} />
        </>
    )
}

export default BookExplorer
