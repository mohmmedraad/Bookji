import { db } from "@/db"
import {
    books as booksTable,
    cartItems as cartItemsTable,
    carts,
    stores as storesTable,
    type NewCartItem,
} from "@/db/schema"
import { wrap } from "@decs/typeschema"
import { TRPCError } from "@trpc/server"
import { and, eq, sql } from "drizzle-orm"
import { number, object } from "valibot"

import { cartItemSchema } from "@/lib/validations/cart"

import { privateProcedure, router } from "../trpc"
import { isBookExists } from "../utils"

export async function createCart(userId: string, items: NewCartItem[] = []) {
    const cart = await db.insert(carts).values({
        userId,
    })

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

export async function getCart(userId: string) {
    const cart = await db
        .select({
            id: carts.id,
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
            >`JSON_ARRAYAGG(
        JSON_OBJECT(
        'id', ${cartItemsTable.id},
        'bookId', ${cartItemsTable.bookId},
        'storeId', ${cartItemsTable.storeId},
        'quantity', ${cartItemsTable.quantity},
        'book', JSON_OBJECT(
            'cover', ${booksTable.cover},
            'title', ${booksTable.title},
            'price', ${booksTable.price}
        )
    ))`,
        })
        .from(carts)
        .where(eq(carts.userId, userId))
        .leftJoin(cartItemsTable, eq(carts.id, cartItemsTable.cartId))
        .leftJoin(booksTable, eq(booksTable.id, cartItemsTable.bookId))
        .innerJoin(
            storesTable,
            and(
                eq(booksTable.storeId, storesTable.id),
                eq(storesTable.isDeleted, false)
            )
        )
        .groupBy(carts.id)

    if (cart.length === 0) return undefined

    return cart[0]
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

export const cartRouter = router({
    get: privateProcedure.query(async ({ ctx }) => {
        // const cart = await db.query.carts.findFirst({
        //     columns: {
        //         id: true,
        //     },
        //     with: {
        //         items: {
        //             with: {
        //                 book: {
        //                     columns: {
        //                         cover: true,
        //                         title: true,
        //                         price: true,
        //                         storeId: true,
        //                     },
        //                 },
        //             },
        //             columns: {
        //                 id: true,
        //                 quantity: true,
        //                 bookId: true,
        //                 storeId: true,
        //             },
        //         },
        //     },
        //     where: (cart, { eq }) => eq(cart.userId, ctx.userId),
        // })

        const cart = await getCart(ctx.userId)

        if (cart === undefined) {
            await createCart(ctx.userId)
            return []
        }

        if (cart.items.length === 0) {
            return []
        }

        const cartItems = cart.items.map((item) => ({
            ...item.book,
            quantity: item.quantity,
            storeId: item.storeId,
            bookId: item.bookId,
        }))
        return cartItems
    }),

    add: privateProcedure
        .input(wrap(cartItemSchema))
        .mutation(async ({ input, ctx }) => {
            const cart = await isCartExist(ctx.userId)

            if (!(await isBookExists(input.bookId))) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Book not found",
                })
            }

            if (!cart) {
                const insertedCart = await createCart(ctx.userId, [input])
                return insertedCart.insertId
            }

            const updatedCart = await db.insert(cartItemsTable).values({
                storeId: input.storeId,
                bookId: input.bookId,
                cartId: cart.id,
            })

            return updatedCart.insertId
        }),

    update: privateProcedure
        .input(
            wrap(
                object({
                    bookId: number(),
                    quantity: number(),
                })
            )
        )
        .mutation(async ({ input, ctx }) => {
            const cart = await getCart(ctx.userId)

            if (!cart) {
                await createCart(ctx.userId)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Cart not found",
                })
            }

            if (!(await isBookExists(input.bookId))) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Book not found",
                })
            }

            const isCartItemNotExist = !cart.items.some(
                (item) => item.bookId === input.bookId
            )

            if (isCartItemNotExist) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Cart item not found",
                })
            }

            if (input.quantity === 0) {
                const deletedCart = await db
                    .delete(cartItemsTable)
                    .where(
                        and(
                            eq(cartItemsTable.cartId, cart.id),
                            eq(cartItemsTable.bookId, input.bookId)
                        )
                    )
                return deletedCart.insertId
            }

            const updatedCart = await db
                .update(cartItemsTable)
                .set({
                    quantity: input.quantity,
                })
                .where(
                    and(
                        eq(cartItemsTable.cartId, cart.id),
                        eq(cartItemsTable.bookId, input.bookId)
                    )
                )

            return updatedCart.insertId
        }),
})
