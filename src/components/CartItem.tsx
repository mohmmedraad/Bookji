import { type FC } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Trash } from "lucide-react"
import { toast } from "sonner"

import { handleGenericError } from "@/lib/utils"
import useCart from "@/hooks/useCart"
import { trpc } from "@/app/_trpc/client"

import EditQuantity from "./EditQuantity"
import Price from "./Price"
import Book from "./ui/BookCover"
import { Button } from "./ui/Button"
import { Separator } from "./ui/Separator"

interface CartItemProps {
    bookId: number
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
    const { cartBooks, setCartBooks, undoChanging } = useCart((state) => ({
        cartBooks: state.cartBooks,
        setCartBooks: state.setCartBooks,
        undoChanging: state.undoChanging,
    }))
    const pathName = usePathname()

    const { mutate: updateCart } = trpc.cart.update.useMutation({
        onError: (error) => {
            undoChanging()
            const errorCode = error.data?.code

            if (errorCode === "UNAUTHORIZED") {
                toast.error("You need to be logged in")
                return router.push(`/sign-in?_origin=${pathName}`)
            }

            return handleGenericError()
        },
    })

    const router = useRouter()

    function handleRemoveItem() {
        const newCartBooks = cartBooks.filter((book) => book.bookId !== bookId)
        updateCart({
            bookId,
            quantity: 0,
        })
        setCartBooks(newCartBooks)
    }

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
                <div className="flex w-full flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="line-clamp-1 overflow-y-hidden text-sm font-semibold text-gray-900">
                            {title}
                        </p>
                        <Price price={price} quantity={quantity} />
                    </div>
                    <div className="flex items-center gap-2">
                        <EditQuantity bookId={bookId} bookQuantity={quantity} />
                        <Button
                            variant={"outline"}
                            className="p-2"
                            onClick={handleRemoveItem}
                        >
                            <Trash className="h-4 w-4 text-foreground" />
                        </Button>
                    </div>
                </div>
            </div>
            <Separator className="mt-8" />
        </div>
    )
}

export default CartItem
