"use client"

import { useEffect, useState, type FC } from "react"
import { A11y, Pagination, Scrollbar } from "swiper/modules"
import { Swiper } from "swiper/react"

import { trpc } from "@/app/_trpc/client"

import SwiperSlide from "../_components/UserBookSlide"

import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/scrollbar"

import UserBooksSkeleton from "../_components/UserBooksSkeleton"

interface UserBooksProps {
    userId: string
    bookId: number
}

const UserBooks: FC<UserBooksProps> = ({ userId, bookId }) => {
    const {
        data,
        isFetching,
        isFetchingNextPage,
        isRefetching,
        fetchNextPage,
    } = trpc.getUserBooks.useInfiniteQuery(
        {
            limit: 5,
            userId,
            excludedBooks: [Number(bookId)],
        },
        {
            getNextPageParam: (lastPage, pages) =>
                lastPage?.length !== 0 ? pages.length : undefined,
            initialCursor: 0,
        }
    )

    const [activeIndex, setActiveIndex] = useState(0)

    const books = data?.pages?.flatMap((page) => page)
    useEffect(() => {
        if (!books) return

        if (activeIndex === books.length - 1) {
            console.log("fetching next page")
            void fetchNextPage()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeIndex, fetchNextPage])

    return (
        <>
            {isFetching && !isFetchingNextPage && !isRefetching ? (
                <div className="flex h-full flex-col items-end gap-6 overflow-hidden">
                    {new Array(3).fill(0).map((_, i) => (
                        <div key={i}>
                            <UserBooksSkeleton />
                        </div>
                    ))}
                </div>
            ) : books?.length === 0 ? (
                <p>this is only book for this user</p>
            ) : (
                <Swiper
                    className="mt-36 h-full"
                    style={{
                        overflowX: "clip",
                        overflowY: "clip",
                        marginTop: "0",
                        transform: "translateY(0)",
                    }}
                    slideActiveClass={"none"}
                    initialSlide={0}
                    slidesPerView={"auto"}
                    spaceBetween={32}
                    centeredSlides={true}
                    navigation={true}
                    direction="vertical"
                    modules={[Pagination, Scrollbar, A11y]}
                    parallax={true}
                    onSlideChange={({ realIndex }) => setActiveIndex(realIndex)}
                    wrapperClass="items-end"
                >
                    {books?.map(({ userFullName, cover, title }, index) => (
                        <SwiperSlide
                            key={title}
                            userFullName={userFullName}
                            title={title}
                            cover={cover!}
                            isActive={index === activeIndex}
                        />
                    ))}
                </Swiper>
            )}
        </>
    )
}

export default UserBooks
