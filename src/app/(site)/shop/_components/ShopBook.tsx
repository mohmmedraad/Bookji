import { forwardRef, type FC } from "react"
import Link from "next/link"

import Book from "@/components/ui/BookCover"

interface ShopBookProps {
    title: string
    slug: string
    cover: string
    author: string
}

const ShopBook: FC<ShopBookProps> = forwardRef<HTMLDivElement, ShopBookProps>(
    ({ slug, cover, title, author, ...props }, ref) => {
        return (
            <div className="text-center" ref={ref} {...props}>
                <Link href={`/book/${slug}`}>
                    <Book
                        alt={`${title}`}
                        src={`${cover}`}
                        width={264}
                        height={380}
                        className="aspect-[2/3]"
                    />
                </Link>
                <h3 className="mt-2 text-sm font-semibold">{title}</h3>
                <h4 className="mt-2 text-xs text-gray-500">{author}</h4>
            </div>
        )
    }
)

ShopBook.displayName = "ShopBook"

export default ShopBook
