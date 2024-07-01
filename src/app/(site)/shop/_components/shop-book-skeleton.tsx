import { type FC } from "react"

import BookWrapper from "@/components/ui/book-wrapper"
import { Skeleton } from "@/components/ui/skeleton"

interface ShopBookSkeletonProps {}

const ShopBookSkeleton: FC<ShopBookSkeletonProps> = ({}) => {
    return (
        <div className="text-center">
            <BookWrapper className="text-center">
                <Skeleton className="aspect-[2/3]" />
            </BookWrapper>
            <Skeleton className="mx-auto mt-2 h-[1em] w-[50%] rounded-sm"></Skeleton>
            <Skeleton className="mx-auto mt-2 h-[.8em] w-[70%] rounded-sm"></Skeleton>
        </div>
    )
}

export default ShopBookSkeleton
