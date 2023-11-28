import { type FC } from "react"

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
                    <h5>
                        {firstName} {lastName}
                    </h5>
                    <p>Collage student</p>
                </div>
            </div>
            <Stars
                stars={rating}
                isStatic={true}
                className="mt-2 flex items-center gap-0"
                starsClassName="w-4 h-4"
            />
            <p className="mt-4">{comment}</p>
        </div>
    )
}

export default BookReview
