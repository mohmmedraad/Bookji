import { type FC } from "react"

import { Separator } from "@/components/ui/Separator"

import AddToCartButton from "../_components/AddToCartButton"
import BookStars from "../_components/BookStars"
import Ratting from "../_components/Ratting"
import Reviews from "../_components/Reviews"
import UserInfo from "./UserInfo"

interface BookInfoProps {
    userId: string
    title: string
    description: string | null
}

const BookInfo: FC<BookInfoProps> = ({
    userId,
    title,
    description,
}) => {
    return (
        <div className="">
            <UserInfo userId={userId} />
            <h2 className="mt-7 text-4xl font-bold text-gray-900">{title}</h2>
            <p className="mt-4 text-xl text-gray-500">{description}</p>
            <BookStars />
            <AddToCartButton />
            <Separator className="my-8" />
            <Ratting />
            <Reviews />
        </div>
    )
}

export default BookInfo
