"use client"

import { useEffect, type FC } from "react"

import useBook, { type BookType } from "@/hooks/useBook"

const BookProvider: FC<BookType> = (book) => {
    const setBook = useBook((state) => state.setBook)

    useEffect(() => {
        setBook({ ...book })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return null
}

export default BookProvider
