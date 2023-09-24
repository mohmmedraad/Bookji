"use client"

import { type FC } from "react"
import { SwiperSlide, useSwiper, useSwiperSlide } from "swiper/react"

import { cn } from "@/lib/utils"

import MaskText from "../MaskText"
import BookCover from "../ui/BookCover"

interface SlideProps {
    author: string
    title: string
    cover: string
    isActive: boolean
}

const Slide: FC<SlideProps> = ({ author, title, cover, isActive }) => {
    return (
        <SwiperSlide
            key={title}
            className={cn("w-[200px] text-center duration-300")}
        >
            <BookCover
                className={"h-[300px] w-full overflow-hidden rounded-md"}
                alt={title}
                height={300}
                width={200}
                src={cover}
            />
            <h4 className="text-xl font-bold">
                <MaskText text={title} isActive={isActive} />
            </h4>
            <p className="-mt-2 text-base text-gray-500">
                <MaskText text={author} isActive={isActive} delay={0.25} />
            </p>
        </SwiperSlide>
    )
}

Slide.displayName = "SwiperSlide" // for the swiperjs to recognize the component
export default Slide
