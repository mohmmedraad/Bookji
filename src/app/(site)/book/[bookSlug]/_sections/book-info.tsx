import { type FC } from "react"

import { getBook } from "@/lib/utils/cached-data"
import { Separator } from "@/components/ui/separator"

import AddToCartButton from "../_components/add-to-cart-button"
import BookStars from "../_components/book-stars"
import Ratting from "../_components/ratting"
import Reviews from "../_components/reviews"
import StoreInfo from "./store-info"

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
            <p className="text-sm text-gray-900">Rate {book?.title}</p>
            <p className="mt-2 text-xs text-gray-500">
                Tell other what your thinks
            </p>
            <Ratting />
            <Reviews />
        </div>
    )
}

export default BookInfo
