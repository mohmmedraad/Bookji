"use client"

import { type FC } from "react"
import { domAnimation, LazyMotion, m } from "framer-motion"

interface MaskTextProps {
    isActive: boolean
    text: string
    delay?: number
}

const MaskText: FC<MaskTextProps> = ({ isActive, text, delay = 0 }) => {
    const animation = {
        initial: { y: "100%" },
        enter: () => ({
            y: "0",
            transition: {
                duration: 0.75,
                ease: [0.33, 1, 0.68, 1],
                delay,
            },
        }),
    }

    return (
        <LazyMotion features={domAnimation}>
            <m.div className="overflow-hidden">
                <m.div
                    variants={animation}
                    initial="initial"
                    animate={isActive ? "enter" : ""}
                >
                    {text}
                </m.div>
            </m.div>
        </LazyMotion>
    )
}

export default MaskText
