"use client"

import { type FC } from "react"
import Link from "next/link"
import { SwiperSlide } from "swiper/react"

import Book from "@/components/ui/BookCover"
import MaskText from "@/components/MaskText"

interface SlideProps {
    id: number
    author: string
    title: string
    cover: string
    isActive: boolean
}

const Slide: FC<SlideProps> = ({
    id,
    author,
    title,
    cover,
    isActive,
}) => {
    return (
        <SwiperSlide
            key={title}
            className={"h-min w-[115px] text-center duration-300"}
            style={{ height: "min-content", width: "115px" }}
        >
            <Link href={`/book/${id}`}>
                <Book
                    className={"h-[165px] w-full overflow-hidden"}
                    alt={title}
                    height={165}
                    width={115}
                    src={cover}
                />
            </Link>
            <h4 className="text-base font-semibold text-gray-900">
                <MaskText text={title} isActive={isActive} />
            </h4>
            <p className="-mt-2 text-sm text-gray-500">
                <MaskText
                    text={author}
                    isActive={isActive}
                    delay={0.25}
                />
            </p>
        </SwiperSlide>
    )
}

Slide.displayName = "SwiperSlide" // for the swiperjs to recognize the component
export default Slide
