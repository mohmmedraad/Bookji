import { type FC } from "react"

import { Separator } from "@/components/ui/Separator"

import AddToCartButton from "../_components/AddToCartButton"
import BookStars from "../_components/BookStars"
import Ratting from "../_components/Ratting"
import Reviews from "../_components/Reviews"
import StoreInfo from "./StoreInfo"

interface BookInfoProps {
    storeId: number
    title: string
    description: string | null
}

const BookInfo: FC<BookInfoProps> = ({ storeId, title, description }) => {
    return (
        <div className="">
            <StoreInfo storeId={storeId} />
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
