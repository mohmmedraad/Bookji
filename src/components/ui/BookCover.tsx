import type { FC, HTMLAttributes } from "react"
import Image from "next/image"

import BookWrapper from "./BookWrapper"

interface BookProps extends HTMLAttributes<HTMLDivElement> {
    src: string
    alt: string
    width: number
    height: number
    className: string
    loading?: "lazy" | "eager"
    priority?: boolean
    fetchPriority?: "high" | "low" | "auto"
    fill?: boolean
}

const Book: FC<BookProps> = ({
    src,
    alt,
    width,
    height,
    className,
    loading = "lazy",
    priority = false,
    fetchPriority = "auto",
    fill = false,
    ...props
}) => {
    return (
        <BookWrapper className={className} {...props}>
            <Image
                width={width}
                height={height}
                alt={alt}
                src={src}
                className="h-full w-full"
                loading={loading}
                priority={priority}
                fetchPriority={fetchPriority}
                fill={fill}
            />
        </BookWrapper>
    )
}

export default Book
