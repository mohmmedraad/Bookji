"use client"

import { useEffect, useState, type FC } from "react"
import { Skeleton } from "@nextui-org/react"
import { A11y, Pagination, Scrollbar } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

// import { books } from "@/config/site"
import Book from "@/components/ui/BookCover"
import BookWrapper from "@/components/ui/BookWrapper"
import MaskText from "@/components/MaskText"
import { trpc } from "@/app/_trpc/client"

import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/scrollbar"

interface UserBooksProps {
    userId: string
    bookId: number
}

const UserBooks: FC<UserBooksProps> = ({ userId, bookId }) => {
    const { data, isFetching, isFetchingNextPage, fetchNextPage } =
        trpc.getUserBooks.useInfiniteQuery(
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

    useEffect(() => {
        if (!data?.pages.length) return

        if (activeIndex === data?.pages.length - 1) {
            void fetchNextPage()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeIndex, fetchNextPage])

    const books = data?.pages?.flatMap((page) => page)

    return (
        <>
            {isFetching && !isFetchingNextPage ? (
                <div className="flex h-full flex-col items-end gap-6 overflow-hidden">
                    {new Array(3).fill(0).map((_, i) => (
                        <div key={i}>
                            <BookWrapper className="h-[165px] w-[115px]">
                                <Skeleton className="h-full w-full" />
                            </BookWrapper>
                            <Skeleton className="mt-2 h-3 w-[100px]" />
                            <Skeleton className="mt-1 h-2 w-[80px]" />
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
                            className={
                                "h-min w-[115px] text-center duration-300"
                            }
                            style={{ height: "min-content", width: "115px" }}
                        >
                            <Book
                                className={"h-[165px] w-full overflow-hidden"}
                                alt={title}
                                height={165}
                                width={115}
                                src={cover!}
                            />
                            <h4 className="text-base font-semibold text-gray-900">
                                <MaskText
                                    text={title}
                                    isActive={index === activeIndex}
                                />
                            </h4>
                            <p className="-mt-2 text-sm text-gray-500">
                                <MaskText
                                    text={userFullName}
                                    isActive={index === activeIndex}
                                    delay={0.25}
                                />
                            </p>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </>
    )
}

export default UserBooks
