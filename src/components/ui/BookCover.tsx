import type { FC, HTMLAttributes } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"

interface BookProps extends HTMLAttributes<HTMLDivElement> {
    src: string
    alt: string
    width: number
    height: number
    className: string
}

const Book: FC<BookProps> = ({
    src,
    alt,
    width,
    height,
    className,
    ...props
}) => {
    return (
        <div
            className={cn("overflow-hidden rounded-md shadow-xl", className)}
            {...props}
        >
            <Image
                width={width}
                height={height}
                alt={alt}
                src={src}
                className="h-full w-full"
            />
        </div>
    )
}

export default Book
