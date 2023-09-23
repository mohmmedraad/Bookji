"use client"

import { type FC } from "react"
import { SwiperSlide, useSwiper } from "swiper/react"

import { cn } from "@/lib/utils"

import BookCover from "../ui/BookCover"

interface SlideProps {
    title: string
    cover: string
    index: number
}

const Slide: FC<SlideProps> = ({ cover, title, index }) => {
    const swiper = useSwiper()
    return (
        <SwiperSlide>
            <BookCover
                className={cn("h-[300px] w-[200px]", {
                    "scale-105": swiper?.realIndex === index,
                })}
                alt={title}
                height={300}
                width={200}
                src={cover}
            />
        </SwiperSlide>
    )
}

export default Slide
