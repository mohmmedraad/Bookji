"use client"

import { type FC } from "react"
import { useRouter } from "next/navigation"
import { type TRPCError } from "@trpc/server"
import { toast } from "sonner"

import { handleGenericError } from "@/lib/utils"
import useBook from "@/hooks/useBook"
import useCart from "@/hooks/useCart"
import { Button } from "@/components/ui/Button"
import { trpc } from "@/app/_trpc/client"

interface AddToCartButtonProps {}

const AddToCartButton: FC<AddToCartButtonProps> = ({}) => {
    const { updateCart, undoChanging, cartBooks } = useCart((store) => ({
        updateCart: store.updateCart,
        undoChanging: store.undoChanging,
        cartBooks: store.cartBooks,
    }))
    const book = useBook((state) => state.book)
    const router = useRouter()

    const { data, mutate: addToCart } = trpc.cart.add.useMutation({
        onMutate: () => {
            if (!book) return
            const isBookInCart = cartBooks.find(
                (item) => item.bookId === book.id
            )
            if (isBookInCart) {
                updateCart({
                    bookId: book.id,
                    quantity: isBookInCart.quantity + 1,
                    ...book,
                })
            } else {
                updateCart({ bookId: book.id, quantity: 1, ...book })
            }
            toast.success("Added to cart")
        },
        onError: (error) => {
            undoChanging()
            handleTRPCError(error.data?.code)
        },
    })

    function handleTRPCError(errorCode: TRPCError["code"] | undefined) {
        if (errorCode === "UNAUTHORIZED") {
            toast.error("Please login first")
            router.push("/sign-in")
        }
        return handleGenericError()
    }

    function handleClick() {
        if (!book) return
        addToCart({ bookId: book.id, quantity: 1 })
    }
    return <Button onClick={handleClick}>Add To Cart</Button>
}

export default AddToCartButton
