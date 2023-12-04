import { type FC } from "react"
import { Trash } from "lucide-react"

import EditQuantity from "./EditQuantity"
import Price from "./Price"
import Book from "./ui/BookCover"
import { Button } from "./ui/Button"
import { Separator } from "./ui/Separator"

interface CartItemProps {
    bookId: string
    title: string
    price: number
    quantity: number
    coverImage: string
}

const CartItem: FC<CartItemProps> = ({
    bookId,
    title,
    price,
    quantity,
    coverImage,
}) => {
    return (
        <div>
            <div className="flex gap-3">
                <Book
                    className="h-[112px] w-[80px] shrink-0"
                    alt="book"
                    width={80}
                    height={112}
                    src={coverImage}
                />
                <div className="flex flex-col justify-between">
                    <div className="flex gap-3">
                        <p className="line-clamp-1 overflow-y-hidden text-sm font-semibold text-gray-900">
                            {title}
                        </p>
                        <EditQuantity bookId={bookId} bookQuantity={quantity} />
                    </div>
                    <div className="flex items-center justify-between">
                        <Button variant={"outline"} className="p-2">
                            <Trash className="h-4 w-4 text-foreground" />
                        </Button>
                        <Price price={price} quantity={quantity} />
                    </div>
                </div>
            </div>
            <Separator className="mt-8" />
        </div>
    )
}

export default CartItem
