import { type FC } from "react"

import { getBook } from "@/lib/utils/cachedResources"
import { Separator } from "@/components/ui/Separator"

import AddToCartButton from "../_components/AddToCartButton"
import BookStars from "../_components/BookStars"
import Ratting from "../_components/Ratting"
import Reviews from "../_components/Reviews"
import StoreInfo from "./StoreInfo"

interface BookInfoProps {
    bookSlug: string
}

const BookInfo: FC<BookInfoProps> = async ({ bookSlug }) => {
    const book = await getBook(bookSlug)

    if (!book) return

    return (
        <div className="">
            <StoreInfo bookSlug={book.slug} />
            <h2 className="mt-7 text-4xl font-bold text-gray-900">
                {book.title}
            </h2>
            <p className="mt-4 text-xl text-gray-500">{book.description}</p>
            <BookStars bookSlug={book.slug} />
            <AddToCartButton />
            <Separator className="my-8" />
            <Ratting />
            <Reviews />
        </div>
    )
}

export default BookInfo
