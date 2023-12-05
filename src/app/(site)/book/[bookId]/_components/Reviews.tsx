"use client"

import { useEffect, useRef, type FC } from "react"
import { useIntersection } from "@mantine/hooks"

import useBook from "@/hooks/useBook"
import { trpc } from "@/app/_trpc/client"

import BookReview from "./BookReview"
import RatingSkeleton from "./RatingSkeleton"

interface ReviewsProps {}

const Reviews: FC<ReviewsProps> = () => {
    const lastPostRef = useRef<HTMLElement>(null)
    const { ref, entry } = useIntersection({
        root: lastPostRef.current,
        threshold: 1,
    })
    const book = useBook((state) => state.book)

    const {
        data,
        isFetchingNextPage,
        fetchNextPage,
        isFetching,
        isRefetching,
    } = trpc.getRatings.useInfiniteQuery(
        {
            limit: 10,
            bookId: book?.id.toString() || "",
        },
        {
            getNextPageParam: (lastPage, pages) =>
                lastPage?.length !== 0 ? pages.length : undefined,
            initialCursor: 0,
        }
    )
    useEffect(() => {
        const isIntersecting = entry?.isIntersecting
        if (isIntersecting) {
            void fetchNextPage()
        }
    }, [entry, fetchNextPage])

    const reviews = data?.pages?.flatMap((page) => page)
    return (
        <div className="mt-8">
            <h4 className="text-xl font-bold text-gray-900">
                Ratings and Reviews
            </h4>
            {reviews?.length === 0 ? (
                <p className="mt-4">No reviews yet</p>
            ) : (
                <div className="mt-4 grid gap-8">
                    {isFetching && !isFetchingNextPage && !isRefetching
                        ? new Array(10)
                              .fill(0)
                              .map((_, i) => <RatingSkeleton key={i} />)
                        : reviews?.map((review, index) => {
                              const isLastBook = index === reviews.length - 1
                              if (isLastBook) {
                                  // Add a ref to the last post in the list
                                  return (
                                      <div key={index} ref={ref}>
                                          <BookReview
                                              userId={review?.userId}
                                              firstName={
                                                  review?.userFullName?.split(
                                                      " "
                                                  )[0] || ""
                                              }
                                              lastName={
                                                  review?.userFullName?.split(
                                                      " "
                                                  )[1] || ""
                                              }
                                              userImage={review?.userImg}
                                              rating={review?.rating}
                                              comment={review?.comment || ""}
                                          />
                                      </div>
                                  )
                              } else {
                                  return (
                                      <BookReview
                                          key={index}
                                          userId={review?.userId}
                                          firstName={
                                              review.userFullName?.split(
                                                  " "
                                              )[0] || ""
                                          }
                                          lastName={
                                              review.userFullName?.split(
                                                  " "
                                              )[1] || ""
                                          }
                                          userImage={review.userImg}
                                          rating={review.rating}
                                          comment={review.comment || ""}
                                      />
                                  )
                              }
                          })}
                    {isFetchingNextPage &&
                        new Array(10)
                            .fill(0)
                            .map((_, i) => <RatingSkeleton key={i} />)}
                </div>
            )}
        </div>
    )
}

export default Reviews
