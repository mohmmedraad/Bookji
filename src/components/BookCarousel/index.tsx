"use client"

import { useState, type FC } from "react"
import { motion } from "framer-motion"
import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules"
import { Swiper, SwiperSlide, useSwiper } from "swiper/react"

import { books } from "@/config/site"

import BookCover from "../ui/BookCover"
// Import Swiper styles
import "swiper/css"
// import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/scrollbar"

import { cn } from "@/lib/utils"

import Slide from "./Slide"
import SwiperNavButtons from "./SwiperNavButtons"

interface BookCarouselProps {
    items: typeof books
}

const BookCarousel: FC<BookCarouselProps> = ({ items }) => {
    const currentIndex = Math.round(items.length / 2)
    const swiper = useSwiper()
    const [currentSlideIndex, setCurrentSlideIndex] =
        useState<number>(currentIndex)
    console.log(swiper)
    return (
        <section about="Best Book" className="pb-8">
            <Swiper
                style={{ overflowX: "clip", overflowY: "initial" }}
                slideActiveClass={"scale-105"}
                initialSlide={currentIndex}
                slidesPerView={2}
                spaceBetween={56}
                centeredSlides={true}
                modules={[Pagination, Scrollbar, A11y]}
                parallax={true}
                onSlideChange={(swiper) =>
                    setCurrentSlideIndex(swiper.realIndex)
                }
                breakpoints={{
                    640: {
                        slidesPerView: 3,
                    },
                    768: {
                        slidesPerView: 4,
                    },
                    1024: {
                        slidesPerView: 5,
                    },
                }}
            >
                {books.map(({ author, cover, title }, index) => (
                    <SwiperSlide
                        style={
                            {
                                // marginRight: currentSlideIndex > index ? 0 : "28px",
                            }
                        }
                        key={title}
                        className={cn("transition-transform duration-300", {})}
                    >
                        <BookCover
                            className={"h-[300px] w-[200px]"}
                            alt={title}
                            height={300}
                            width={200}
                            src={cover}
                        />
                    </SwiperSlide>
                ))}
                <SwiperNavButtons />
            </Swiper>
        </section>
    )
}

export default BookCarousel
