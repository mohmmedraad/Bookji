"use client"

import { type FC } from "react"
import { useSwiper } from "swiper/react"

import { cn } from "@/lib/utils"

import { Icons } from "../Icons"
import { Button } from "../ui/button"
import Container from "../ui/container"

const SwiperNavButtons: FC = ({}) => {
    const swiper = useSwiper()
    return (
        <Container className="absolute left-1/2 top-[40%] z-50 flex -translate-x-1/2 -translate-y-1/2 justify-between">
            <Button
                className={cn("h-10 rounded-full p-2 shadow-md")}
                onClick={() => swiper.slidePrev()}
            >
                <Icons.Arrow width={24} height={24} className="rotate-180" />
            </Button>
            <Button
                className={cn("h-10 rounded-full p-2 shadow-md")}
                onClick={() => swiper.slideNext()}
            >
                <Icons.Arrow width={24} height={24} />
            </Button>
        </Container>
    )
}

export default SwiperNavButtons
