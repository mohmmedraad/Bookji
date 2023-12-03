import { db } from "@/db"
import { carts } from "@/db/schema"
import { type CartItem } from "@/types"

export async function createCart(
    userId: string,
    items: CartItem[] | undefined = []
) {
    const cart = await db.insert(carts).values({
        userId,
        items,
    })
    return cart
}

export async function getCart(userId: string) {
    const cart = await db.query.carts.findFirst({
        columns: {
            id: true,
            items: true,
        },
        where: (cart, { eq }) => eq(cart.userId, userId),
    })
    return cart
}

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
