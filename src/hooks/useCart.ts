import { type CartItem } from "@/types"
import { create, useStore } from "zustand"

import { decreaseBookQuantity, updateCartBook } from "@/lib/utils/cart"

interface ExtendedCartItem extends CartItem {
    cover?: string | null | undefined
    title?: string | undefined
    price?: string | undefined
}

interface Store {
    cartBooks: ExtendedCartItem[]
    prevCartBooks: ExtendedCartItem[]

    setCartBooks: (cartBooks: ExtendedCartItem[]) => void
    updateCart: (book: CartItem) => void
    decreaseQuantity: (bookToUpdate: ExtendedCartItem) => void
    addBook: (bookToUpdate: ExtendedCartItem) => void
    undoChanging: () => void
}
// : cartBooks.filter((book) => book.quantity > 0)
function update(cartBooks: ExtendedCartItem[], book: CartItem) {
    const updatedCartBooks = cartBooks.map((item) => {
        if (item.bookId !== book.bookId) {
            return item
        }
        return {
            ...item,
            quantity: book.quantity,
        }
    })
    return updatedCartBooks.filter((book) => book.quantity > 0)
}

const useCart = create<Store>((set, get) => ({
    cartBooks: [],
    prevCartBooks: [],
    setCartBooks: (cartBooks) => set({ cartBooks }),
    updateCart: (book) => set({ cartBooks: update(get().cartBooks, book) }),
    decreaseQuantity: (bookToUpdate) => {
        set({ prevCartBooks: get().cartBooks })
        set({ cartBooks: decreaseBookQuantity(get().cartBooks, bookToUpdate) })
    },
    addBook: (book) => {
        set({ prevCartBooks: get().cartBooks })
        set({ cartBooks: updateCartBook(get().cartBooks, book) })

        console.log("cartBooks: ", get().cartBooks)
    },
    undoChanging: () => set((state) => ({ cartBooks: state.prevCartBooks })),
}))

export default useCart
