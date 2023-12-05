"use client"

import { useEffect, type FC } from "react"

import useBook, { type BookType } from "@/hooks/useBook"

const BookProvider: FC<BookType> = ({
    id,
    userId,
    title,
    description,
    cover,
    price,
}) => {
    const setBook = useBook((state) => state.setBook)

    useEffect(() => {
        setBook({ id, userId, title, description, cover, price })
    }, [])

    return null
}

export default BookProvider
