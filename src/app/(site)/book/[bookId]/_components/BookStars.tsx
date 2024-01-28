"use client"

import { type FC } from "react"
import { Progress, Skeleton } from "@nextui-org/react"

import useBook from "@/hooks/useBook"
import { trpc } from "@/app/_trpc/client"

import Stars from "./Stars"

interface BookStarsProps {}

const getStarsAverage = (stars: Record<string, number>, totalStars: number) => {
    const keys = Object.keys(stars)
    keys.forEach((star) => {
        stars[star] = (stars[star] / totalStars) * 100
    })

    return stars
}

function calculateAverageRating(
    ratings: {
        rating: number
    }[]
) {
    // Check if the ratings array is not empty
    console.log("ratings: ", ratings)

    const stars: Record<string, number> = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
    }
    if (ratings.length === 0) {
        return { averageRating: 0, stars } // Avoid division by zero if there are no ratings
    }

    // Calculate the sum of ratings
    const totalRatings = ratings.reduce((sum, rating) => {
        if (rating.rating in stars) stars[rating.rating]++
        return sum + rating.rating
    }, 0)

    let totalResponses = 0
    for (const star in stars) {
        totalResponses += stars[star]
    }

    // Calculate the average
    const averageRating = totalRatings / totalResponses

    return { averageRating, stars: getStarsAverage(stars, totalResponses) }
}

const BookStars: FC<BookStarsProps> = ({}) => {
    const book = useBook((state) => state.book)
    const { data, isFetching, isRefetching } = trpc.getBookRating.useQuery({
        bookId: book?.id || 0,
    })

    const { averageRating, stars } = calculateAverageRating(data || [])
    console.log(averageRating)
    return (
        <div className="my-8 flex flex-wrap items-center gap-8">
            <div>
                <div className="mx-auto text-6xl font-bold text-gray-900 md:text-7xl">
                    {averageRating.toFixed(1)}
                </div>
                {isFetching && !isRefetching ? (
                    <div className="mt-4 flex">
                        {new Array(5).fill(0).map((_, i) => (
                            <Skeleton key={i} className="star h-4 w-4" />
                        ))}
                    </div>
                ) : (
                    <Stars
                        className="mt-4 gap-0"
                        starsClassName="h-4 w-4"
                        isStatic={true}
                        stars={averageRating}
                    />
                )}
                <p className="mt-2 text-sm text-gray-500">
                    {data?.length.toLocaleString() || 0}
                </p>
            </div>
            <div className="grid w-28 gap-4 ">
                {Object.keys(stars).map((star) => {
                    return (
                        <div className="flex items-center gap-2" key={star}>
                            <div className="text-xs text-gray-500">{star}</div>
                            <label className="sr-only">Rating</label>
                            <Progress
                                size="sm"
                                className="w-32"
                                aria-label="Rating"
                                value={stars[star]}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default BookStars
