import { type CartItem } from "@/types"
import { create } from "zustand"

export interface ExtendedCartItem extends CartItem {
    cover?: string | null | undefined
    title?: string | undefined
    price?: string
    storeId?: number
}

interface Store {
    cartBooks: ExtendedCartItem[]
    prevCartBooks: ExtendedCartItem[]
    isLoading: boolean

    setIsLoading: (isLoading: boolean) => void
    setCartBooks: (cartBooks: ExtendedCartItem[]) => void
    updateCart: (book: CartItem) => void
    addBook: (bookToUpdate: ExtendedCartItem) => void
    undoChanging: () => void
}
// : cartBooks.filter((book) => book.quantity > 0)
function update(cartBooks: ExtendedCartItem[], book: CartItem) {
    const isBookNotExists = !cartBooks.some(
        (item) => item.bookId === book.bookId
    )
    if (isBookNotExists) {
        return [...cartBooks, book]
    }
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
    isLoading: true,
    setIsLoading: (isLoading) => set({ isLoading }),
    setCartBooks: (cartBooks) => set({ cartBooks }),
    updateCart: (book) => {
        set({ prevCartBooks: get().cartBooks })
        set({ cartBooks: update(get().cartBooks, book) })
    },
    addBook: (book) => {
        set({ prevCartBooks: get().cartBooks })
        set({ cartBooks: update(get().cartBooks, book) })
    },
    undoChanging: () => set((state) => ({ cartBooks: state.prevCartBooks })),
}))

export default useCart
