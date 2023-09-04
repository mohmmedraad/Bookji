import type { FC, HTMLAttributes } from "react"
import Image from "next/image"

interface BookProps extends HTMLAttributes<HTMLDivElement> {
    src: string
    alt: string
    width: number
    height: number
}

const Book: FC<BookProps> = ({ src, alt, width, height, ...props }) => {
    return (
        <div {...props}>
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
