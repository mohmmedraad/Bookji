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

import MaskText from "../MaskText"
import Client from "../ui/Client"
import Slide from "./Slide"
import SwiperNavButtons from "./SwiperNavButtons"

interface BookCarouselProps {
    items: typeof books
}

const BookCarousel: FC<BookCarouselProps> = ({ items }) => {
    const currentIndex = Math.round(items.length / 2)
    const [activeIndex, setActiveIndex] = useState(currentIndex)
    return (
        <section about="Best Book" className="py-20">
            <Client>
                <Swiper
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
                    {books.map(({ author, cover, title }, index) => (
                        <SwiperSlide
                            key={title}
                            className={cn("w-[200px] text-center duration-300")}
                        >
                            <BookCover
                                className={
                                    "h-[300px] w-full overflow-hidden rounded-md"
                                }
                                alt={title}
                                height={300}
                                width={200}
                                src={cover}
                            />
                            <h4 className="text-xl font-bold">
                                <MaskText
                                    text={title}
                                    isActive={index === activeIndex}
                                />
                            </h4>
                            <p className="-mt-2 text-base text-gray-500">
                                <MaskText
                                    text={author}
                                    isActive={index === activeIndex}
                                    delay={0.25}
                                />
                            </p>
                        </SwiperSlide>
                    ))}
                    <SwiperNavButtons />
                </Swiper>
            </Client>
        </section>
    )
}

export default BookCarousel
