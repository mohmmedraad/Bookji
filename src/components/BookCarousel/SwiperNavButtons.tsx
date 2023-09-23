"use client"

import { type FC } from "react"
import { useSwiper } from "swiper/react"

import { Icons } from "../Icons"
import { Button } from "../ui/Button"

interface SwiperNavButtonsProps {}

const SwiperNavButtons: FC<SwiperNavButtonsProps> = ({}) => {
    const swiper = useSwiper()
    return (
        <div className="swiper-nav-btns container absolute left-1/2 top-1/2 z-50 flex -translate-x-1/2 -translate-y-1/2 justify-between">
            <Button className="rounded-full" onClick={() => swiper.slidePrev()}>
                <Icons.Arrow width={24} height={24} />
            </Button>
            <Button className="rounded-full" onClick={() => swiper.slideNext()}>
                <Icons.Arrow width={24} height={24} />
            </Button>
        </div>
    )
}

export default SwiperNavButtons
