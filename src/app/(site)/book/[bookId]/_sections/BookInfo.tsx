import { type FC } from "react"

import { Separator } from "@/components/ui/Separator"

import AddToCartButton from "../_components/AddToCartButton"
import BookStars from "../_components/BookStars"
import Ratting from "../_components/Ratting"
import Reviews from "../_components/Reviews"
import UserInfo from "./UserInfo"

interface BookInfoProps {
    id: number
    bookId: string
    userId: string
    title: string
    description: string | null
}

const BookInfo: FC<BookInfoProps> = ({
    id,
    userId,
    title,
    description,
    bookId,
}) => {
    return (
        <div className="">
            <UserInfo userId={userId} />
            <h2 className="mt-7 text-4xl font-bold text-gray-900">{title}</h2>
            <p className="mt-4 text-xl text-gray-500">{description}</p>
            <BookStars id={id.toString()} />
            <AddToCartButton />
            <Separator className="my-8" />
            <Ratting title={title} bookId={bookId} />
            <Reviews bookId={bookId} />
        </div>
    )
}

export default BookInfo
