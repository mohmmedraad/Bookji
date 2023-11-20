"use client"

import { useState, type FC } from "react"
import { A11y, Pagination, Scrollbar } from "swiper/modules"
import { Swiper } from "swiper/react"

import { type BooksType } from "@/config/site"

import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/scrollbar"

import Client from "../ui/Client"
import SwiperSlide from "./Slide"
import SwiperNavButtons from "./SwiperNavButtons"

interface BookCarouselProps {
    items: BooksType
}

const BookCarousel: FC<BookCarouselProps> = ({ items }) => {
    const currentIndex = Math.round(items.length / 2)
    const [activeIndex, setActiveIndex] = useState(currentIndex)
    return (
        <Client>
            <Swiper
                className="mt-36"
                style={{ overflowX: "clip", overflowY: "initial" }}
                slideActiveClass={"swiper-slide-active"}
                initialSlide={currentIndex}
                slidesPerView={"auto"}
                spaceBetween={56}
                centeredSlides={true}
                modules={[Pagination, Scrollbar, A11y]}
                parallax={true}
                onSlideChange={({ realIndex }) => setActiveIndex(realIndex)}
            >
                {items.map(({ userFullName, cover, title }, index) => (
                    <SwiperSlide
                        key={title}
                        author={userFullName}
                        title={title}
                        cover={cover}
                        isActive={index === activeIndex}
                    />
                ))}
                <SwiperNavButtons />
            </Swiper>
        </Client>
    )
}

export default BookCarousel
