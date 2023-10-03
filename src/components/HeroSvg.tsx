"use client"

import { FC, SVGProps } from "react"
import { motion } from "framer-motion"

const HeroSvg: FC = () => {
    return (
        <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="1536"
            height="1091"
            viewBox="0 0 1536 1091"
            fill="none"
            className="absolute left-1/2 top-0 z-[-1] -translate-x-1/2"
        >
            <motion.path
                d="M-399 591C-259.667 592.667 32 710.5 145 367C226.678 118.715 538.52 173.798 714 131.5C867.5 94.5 881 -4.99994 714 -33.4999C556.28 -60.4162 500 209 881 236C1324.39 267.421 1333.5 579.5 1263 736C1192.5 892.5 1431.5 1056 1692.5 1010.5C1901.3 974.1 1980.5 1143.67 1994 1233"
                stroke="#F00B52"
                strokeWidth="5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                    duration: 2,
                    ease: "easeInOut",
                    // ease: "cubic-bezier(0,-0.02,.42,1)",
                }}
            />
        </motion.svg>
    )
}

export default HeroSvg
