import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { handleGenericError } from "@/lib/utils"
import { trpc } from "@/app/_trpc/client"

import useBook from "../store/useBook"
import useCart from "../store/useCart"

export const useAddToCartButton = () => {
    const { updateCart, undoChanging, cartBooks } = useCart((store) => ({
        updateCart: store.updateCart,
        undoChanging: store.undoChanging,
        cartBooks: store.cartBooks,
    }))
    const book = useBook((state) => state.book)
    const router = useRouter()

    const { isLoading, mutate: updateDdCart } = trpc.cart.add.useMutation({
        onMutate: () => {
            if (!book) return
            const isBookInCart = cartBooks.find(
                (item) => item.bookId === book.id
            )

            const quantity = isBookInCart ? isBookInCart.quantity + 1 : 1

            updateCart({ bookId: book.id, quantity, ...book })
            return toast.success("Added to cart")
        },
        onError: (error) => {
            undoChanging()
            const errorCode = error.data?.code
            if (errorCode === "UNAUTHORIZED") {
                toast.error("You need to login first to add to cart.")
                router.push(`/sign-in?_origin=/book/${book?.slug}`)
                return
            }
            return handleGenericError()
        },
    })

    function addToCart() {
        if (!book) return
        updateDdCart({ bookId: book.id, quantity: 1, storeId: book.storeId })
    }

    return { addToCart, isLoading }
}
