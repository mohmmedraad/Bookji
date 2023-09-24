"use client"

import { type FC } from "react"
import { motion } from "framer-motion"

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
        <>
            <motion.div className="overflow-hidden">
                <motion.div
                    variants={animation}
                    initial="initial"
                    animate={isActive ? "enter" : ""}
                >
                    {text}
                </motion.div>
            </motion.div>
        </>
    )
}

export default MaskText
