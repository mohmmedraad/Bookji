import { type FC } from "react"

import { Separator } from "@/components/ui/Separator"
import { UserAvatar } from "@/components/UserAvatar"

import Stars from "./Stars"

interface BookReviewProps {
    userId: string
    firstName: string
    lastName: string
    userImage?: string
    rating: number
    comment: string
}

const BookReview: FC<BookReviewProps> = ({
    userId,
    userImage,
    firstName,
    lastName,
    rating,
    comment,
}) => {
    return (
        <div>
            <div className="flex gap-4">
                <UserAvatar
                    user={{
                        firstName,
                        lastName,
                        imageUrl: userImage || "",
                    }}
                    className="h-8 w-8"
                />
                <div>
                    <h5 className="text-xs font-bold text-gray-900">
                        {firstName} {lastName}
                    </h5>
                    <p className="mt-1 text-[10px] text-gray-500">
                        Collage student
                    </p>
                </div>
            </div>
            <Stars
                stars={rating}
                isStatic={true}
                className="mt-2 flex items-center gap-0"
                starsClassName="w-4 h-4"
            />
            <p className="mt-4 text-sm text-gray-500">{comment}</p>
            <Separator className="mt-8" />
        </div>
    )
}

export default BookReview
