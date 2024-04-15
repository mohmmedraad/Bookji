import { db } from "@/db"
import {
    books as booksTable,
    cartItems as cartItemsTable,
    carts as cartsTable,
    stores as storesTable,
    type NewCartItem,
} from "@/db/schema"
import { type ExtendedCartItem } from "@/store/useCart"
import { type CartItem } from "@/types"
import { and, eq, sql } from "drizzle-orm"

export function isBookNotExists(cartBooks: CartItem[], bookToCheck: CartItem) {
    return !cartBooks.some((book) => book.bookId === bookToCheck.bookId)
}
export async function getCart(userId: string) {
    const cart = await db
        .select({
            id: cartsTable.id,
            items: sql<
                {
                    id: number
                    storeId: number
                    bookId: number
                    quantity: number
                    book: {
                        title: string
                        cover: string | null
                        price: string
                    }
                }[]
            >`json_agg(
                json_build_object(
                    'id', ${cartItemsTable.id},
                    'bookId', ${cartItemsTable.bookId},
                    'storeId', ${cartItemsTable.storeId},
                    'quantity', ${cartItemsTable.quantity},
                    'book', json_build_object(
                        'cover', ${booksTable.cover},
                        'title', ${booksTable.title},
                        'price', ${booksTable.price}
                    )
                )
            )`,
        })
        .from(cartsTable)
        .where(eq(cartsTable.userId, userId))
        .leftJoin(cartItemsTable, eq(cartsTable.id, cartItemsTable.cartId))
        .leftJoin(booksTable, eq(booksTable.id, cartItemsTable.bookId))
        .leftJoin(
            storesTable,
            and(
                eq(booksTable.storeId, storesTable.id),
                eq(storesTable.isDeleted, false)
            )
        )
        .groupBy(cartsTable.id)

    if (cart.length === 0) return undefined

    const userCart = cart[0]

    if (userCart.items[0].id === null) {
        return {
            id: userCart.id,
            items: [],
        }
    }

    return userCart
}

export async function createCart(userId: string, items: NewCartItem[] = []) {
    const cart = (
        await db
            .insert(cartsTable)
            .values({
                userId,
            })
            .returning({ insertId: cartsTable.id })
    )[0]

    if (items.length === 0) {
        return cart
    }

    await db.insert(cartItemsTable).values(
        items.map((item) => ({
            storeId: item.storeId,
            bookId: item.bookId,
            cartId: Number(cart.insertId),
        }))
    )
    return cart
}

export async function isCartExist(userId: string) {
    const cart = await db.query.carts.findFirst({
        columns: {
            id: true,
        },
        where: (cart) => eq(cart.userId, userId),
    })
    return cart
}
