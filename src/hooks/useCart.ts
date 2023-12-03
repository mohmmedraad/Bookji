import { type CartItem } from "@/types"
import { create, useStore } from "zustand"

import { decreaseBookQuantity, updateCartBook } from "@/lib/utils/cart"

interface Store {
    cartBooks: CartItem[]
    prevCartBooks: CartItem[]

    setCartBooks: (cartBooks: CartItem[]) => void
    decreaseQuantity: (bookToUpdate: CartItem) => void
    addBook: (bookToUpdate: CartItem) => void
    undoChanging: () => void
}

const useCart = create<Store>((set, get) => ({
    cartBooks: [],
    prevCartBooks: [],
    setCartBooks: (cartBooks) => set({ cartBooks }),
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
