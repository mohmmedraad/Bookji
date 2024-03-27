import { type FC } from "react"
import { db } from "@/db"
import { eq } from "drizzle-orm"

import { getBook } from "@/lib/utils/cachedResources"

import ProgressBar from "./ProgressBar"
import Stars from "./Stars"

interface BookStarsProps {
    bookSlug: string
}

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

const BookStars: FC<BookStarsProps> = async ({ bookSlug }) => {
    const book = await getBook(bookSlug)

    if (!book) return

    const bookRating = await db.query.ratings.findMany({
        columns: {
            rating: true,
        },
        where: (rate) => eq(rate.bookId, book.id),
    })

    const { averageRating, stars } = calculateAverageRating(bookRating)
    return (
        <div className="my-8 flex flex-wrap items-center gap-8">
            <div>
                <div className="mx-auto text-6xl font-bold text-gray-900 md:text-7xl">
                    {averageRating.toFixed(1)}
                </div>
                <Stars
                    className="mt-4 gap-0"
                    starsClassName="h-4 w-4"
                    isStatic={true}
                    stars={averageRating}
                />
                {/* )} */}
                <p className="mt-2 text-sm text-gray-500">
                    {bookRating?.length.toLocaleString() || 0}
                </p>
            </div>
            <div className="grid w-28 gap-4 ">
                {Object.keys(stars).map((star) => {
                    return (
                        <div className="flex items-center gap-2" key={star}>
                            <div className="text-xs text-gray-500">{star}</div>
                            <label className="sr-only">Rating</label>
                            <ProgressBar
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
