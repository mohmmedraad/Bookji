import { type CartItem } from "@/types"

import { type ExtendedCartItem } from "@/hooks/useCart"

export function updateCartBook(cartBooks: CartItem[], bookToUpdate: CartItem) {
    if (isBookNotExists(cartBooks, bookToUpdate)) {
        cartBooks.push(bookToUpdate)
        return cartBooks
    }

    return cartBooks.map((book) => {
        if (book.bookId !== bookToUpdate.bookId) {
            return book
        }

        return {
            ...book,
            quantity: book.quantity + bookToUpdate.quantity,
        }
    })
}

export function decreaseBookQuantity(
    cartBooks: CartItem[],
    bookToUpdate: CartItem
) {
    const updatedCartBooks: CartItem[] = []

    cartBooks.forEach((book) => {
        if (book.bookId !== bookToUpdate.bookId) {
            updatedCartBooks.push(book)
        }
        if (book.quantity !== 1) {
            updatedCartBooks.push({
                ...book,
                quantity: book.quantity - bookToUpdate.quantity,
            })
        }
    })
    return updatedCartBooks
}

export function isBookNotExists(cartBooks: CartItem[], bookToCheck: CartItem) {
    return !cartBooks.some((book) => book.bookId === bookToCheck.bookId)
}

export function getCartTotal(cartBooks: ExtendedCartItem[]) {
    return cartBooks.reduce(
        (total, book) => total + +book.price! * book.quantity,
        0
    )
}
