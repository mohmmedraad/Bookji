import { db } from "@/db"
import {
    books,
    cartItems as cartItemsTable,
    carts,
    type Cart,
    type NewCartItem,
} from "@/db/schema"
import { type CartItem } from "@/types"
import { wrap } from "@decs/typeschema"
import { TRPCError } from "@trpc/server"
import { and, eq, inArray } from "drizzle-orm"
import { array, number, object } from "valibot"

import {
    decreaseBookQuantity,
    isBookNotExists,
    updateCartBook,
} from "@/lib/utils/cart"
import { cartItemSchema } from "@/lib/validations/cart"

import { privateProcedure, router } from "../trpc"

export async function createCart(userId: string, items: NewCartItem[] = []) {
    const cart = await db.insert(carts).values({
        userId,
    })

    if (!items) {
        return cart
    }

    const cartItems = await db.insert(cartItemsTable).values(
        items.map((item) => ({
            storeId: item.storeId,
            bookId: item.bookId,
            cartId: Number(cart.insertId),
        }))
    )
    return cart
}

export async function getCart(userId: string) {
    const cart = await db.query.carts.findFirst({
        columns: {
            id: true,
        },
        with: {
            items: {
                columns: {
                    bookId: true,
                    quantity: true,
                    storeId: true,
                },
            },
        },
        where: (cart, { eq }) => eq(cart.userId, userId),
    })
    return cart
}

// async function addBookToCart(
//     cart: Pick<Cart, "id" | "items">,
//     input: CartItem,
//     userId: string
// ) {
//     let cartItems = cart.items || []
//     if (cartItems.length === 0) {
//         cartItems = [input]
//     } else {
//         cartItems = updateCartBook(cartItems, input)
//     }

//     const updatedCart = await db
//         .update(carts)
//         .set({
//             items: cartItems,
//         })
//         .where(eq(carts.userId, userId))
//     return updatedCart
// }

export const cartRouter = router({
    get: privateProcedure.query(async ({ ctx }) => {
        const cart = await db.query.carts.findFirst({
            columns: {
                id: true,
            },
            with: {
                items: {
                    with: {
                        book: {
                            columns: {
                                cover: true,
                                title: true,
                                price: true,
                                storeId: true,
                            },
                        },
                    },
                    columns: {
                        id: true,
                        quantity: true,
                        bookId: true,
                        storeId: true,
                    },
                },
            },
            where: (cart, { eq }) => eq(cart.userId, ctx.userId),
        })

        if (!cart) {
            await createCart(ctx.userId)
            return []
        }

        if (cart.items.length === 0) {
            return []
        }

        // const booksIds = cart.items.map((item) => +item.bookId)

        // const cartItems = await db
        //     .select({
        //         bookId: books.id,
        //         cover: books.cover,
        //         title: books.title,
        //         price: books.price,
        //         storeId: books.storeId,
        //     })
        //     .from(books)
        //     .where(inArray(books.id, booksIds))

        const cartItems = cart.items.map((item) => ({
            ...item.book,
            quantity: item.quantity,
            storeId: item.storeId,
            bookId: item.bookId,
        }))
        return cartItems

        // return cart.items.map((item) => ({
        //     ...cartItems.find((book) => book.bookId === +item.bookId),
        //     ...item,
        // }))
    }),

    add: privateProcedure
        .input(wrap(cartItemSchema))
        .mutation(async ({ input, ctx }) => {
            const cart = await getCart(ctx.userId)

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
            // const updatedCart = await db
            //     .update(carts)
            //     .set({
            //         items: input,
            //     })
            //     .where(eq(carts.userId, ctx.userId))

            // return updatedCart.insertId
        }),

    // decreaseQuantity: privateProcedure
    //     .input(wrap(cartItemSchema))
    //     .mutation(async ({ input, ctx }) => {
    //         const cart = await getCart(ctx.userId)

    //         if (!cart) {
    //             await createCart(ctx.userId)
    //             throw new TRPCError({
    //                 code: "NOT_FOUND",
    //                 message: "Cart not found",
    //             })
    //         }
    //         let cartItems = cart.items || []

    //         if (cartItems.length === 0) {
    //             return []
    //         }

    //         if (isBookNotExists(cartItems, input)) {
    //             return []
    //         } else {
    //             cartItems = decreaseBookQuantity(cartItems, input)
    //         }

    //         const updatedCart = await db
    //             .update(carts)
    //             .set({
    //                 items: cartItems,
    //             })
    //             .where(eq(carts.userId, ctx.userId))

    //         return updatedCart.insertId
    //     }),

    // getStoreBooks: privateProcedure
    //     .input(
    //         wrap(
    //             object({
    //                 storeId: number(),
    //             })
    //         )
    //     )
    //     .query(async ({ input: { storeId }, ctx: { userId } }) => {
    //         const cart = await getCart(userId)

    //         if (!cart) {
    //             await createCart(userId)
    //             return []
    //         }

    //         if (cart.items === null || cart.items.length === 0) {
    //             return []
    //         }

    //         const booksIds = cart.items.map((item) => item.bookId)

    //         const cartItems = await db
    //             .select({
    //                 bookId: books.id,
    //                 cover: books.cover,
    //                 title: books.title,
    //                 price: books.price,
    //             })
    //             .from(books)
    //             .where(
    //                 and(eq(books.storeId, storeId), inArray(books.id, booksIds))
    //             )

    //         return cartItems.map((item) => ({
    //             ...item,
    //             quantity:
    //                 cart.items?.find((book) => book.bookId === item.bookId)
    //                     ?.quantity || 0,
    //         }))
    //     }),
})
