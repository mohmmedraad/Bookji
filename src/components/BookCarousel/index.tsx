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
    return (
        <section about="Best Book" className="pb-8">
            <Swiper
                style={{ overflowX: "clip", overflowY: "initial" }}
                slideActiveClass={"swiper-slide-active"}
                initialSlide={currentIndex}
                slidesPerView={"auto"}
                spaceBetween={56}
                centeredSlides={true}
                modules={[Pagination, Scrollbar, A11y]}
                parallax={true}
            >
                {books.map(({ author, cover, title }, index) => (
                    <SwiperSlide
                        key={title}
                        className={cn("w-[200px] duration-300")}
                    >
                        <BookCover
                            className={"h-[300px] w-full"}
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
