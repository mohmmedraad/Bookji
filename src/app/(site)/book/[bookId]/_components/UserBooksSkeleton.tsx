import { type FC } from "react"
import { Skeleton } from "@nextui-org/react"

import BookWrapper from "@/components/ui/BookWrapper"

interface UserBooksSkeletonProps {}

const UserBooksSkeleton: FC<UserBooksSkeletonProps> = ({}) => {
    return (
        <>
            <BookWrapper className="h-[165px] w-[115px]">
                <Skeleton className="h-full w-full" />
            </BookWrapper>
            <Skeleton className="mt-2 h-3 w-[100px]" />
            <Skeleton className="mt-1 h-2 w-[80px]" />
        </>
    )
}

export default UserBooksSkeleton
