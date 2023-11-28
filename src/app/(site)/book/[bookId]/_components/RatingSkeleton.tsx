"use client"

import { type FC } from "react"
import { Skeleton } from "@nextui-org/react"

interface RatingSkeletonProps {}

const RatingSkeleton: FC<RatingSkeletonProps> = ({}) => {
    return (
        <div>
            <div className="flex gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div>
                    <Skeleton className="h-3 w-32 rounded-sm" />
                    <Skeleton className="mt-1 h-[10px] w-28 rounded-sm" />
                </div>
            </div>
            <div className="mt-2 flex items-center">
                {new Array(5).fill(0).map((_, i) => (
                    <div key={i}>
                        <Skeleton className="star h-4 w-4" />
                    </div>
                ))}
            </div>
            <div className="mt-4">
                {new Array(3)
                    .fill(0)
                    .map((_, i) =>
                        i === 2 ? (
                            <Skeleton key={i} className="mt-1 h-[14px] w-1/2" />
                        ) : (
                            <Skeleton
                                key={i}
                                className="mt-1 h-[14px] w-full"
                            />
                        )
                    )}
            </div>
        </div>
    )
}

export default RatingSkeleton
