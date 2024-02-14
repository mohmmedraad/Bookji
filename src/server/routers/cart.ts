import { db } from "@/db"
import { books, carts, type Cart } from "@/db/schema"
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

async function addBookToCart(
    cart: Pick<Cart, "id" | "items">,
    input: CartItem,
    userId: string
) {
    let cartItems = cart.items || []
    if (cartItems.length === 0) {
        cartItems = [input]
    } else {
        cartItems = updateCartBook(cartItems, input)
    }

    const updatedCart = await db
        .update(carts)
        .set({
            items: cartItems,
        })
        .where(eq(carts.userId, userId))
    return updatedCart
}

export const cartRouter = router({
    get: privateProcedure.query(async ({ ctx }) => {
        const cart = await getCart(ctx.userId)

        if (!cart) {
            await createCart(ctx.userId)
            return []
        }

        if (cart.items === null || cart.items.length === 0) {
            return []
        }

        const booksIds = cart.items.map((item) => +item.bookId)

        const cartItems = await db
            .select({
                bookId: books.id,
                cover: books.cover,
                title: books.title,
                price: books.price,
                storeId: books.storeId,
            })
            .from(books)
            .where(inArray(books.id, booksIds))

        return cart.items.map((item) => ({
            ...cartItems.find((book) => book.bookId === +item.bookId),
            ...item,
        }))
    }),

    add: privateProcedure
        .input(wrap(cartItemSchema))
        .mutation(async ({ input, ctx }) => {
            const cart = await getCart(ctx.userId)

            if (!cart) {
                const insertedCart = await createCart(ctx.userId, [input])
                return insertedCart.insertId
            }

            const updatedCart = await addBookToCart(cart, input, ctx.userId)
            return updatedCart.insertId
        }),

    update: privateProcedure
        .input(wrap(array(cartItemSchema)))
        .mutation(async ({ input, ctx }) => {
            const cart = await getCart(ctx.userId)

            if (!cart) {
                await createCart(ctx.userId)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Cart not found",
                })
            }

            const updatedCart = await db
                .update(carts)
                .set({
                    items: input,
                })
                .where(eq(carts.userId, ctx.userId))

            return updatedCart.insertId
        }),

    decreaseQuantity: privateProcedure
        .input(wrap(cartItemSchema))
        .mutation(async ({ input, ctx }) => {
            const cart = await getCart(ctx.userId)

            if (!cart) {
                await createCart(ctx.userId)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Cart not found",
                })
            }
            let cartItems = cart.items || []

            if (cartItems.length === 0) {
                return []
            }

            if (isBookNotExists(cartItems, input)) {
                return []
            } else {
                cartItems = decreaseBookQuantity(cartItems, input)
            }

            const updatedCart = await db
                .update(carts)
                .set({
                    items: cartItems,
                })
                .where(eq(carts.userId, ctx.userId))

            return updatedCart.insertId
        }),

    getStoreBooks: privateProcedure
        .input(
            wrap(
                object({
                    storeId: number(),
                })
            )
        )
        .query(async ({ input: { storeId }, ctx: { userId } }) => {
            const cart = await getCart(userId)

            if (!cart) {
                await createCart(userId)
                return []
            }

            if (cart.items === null || cart.items.length === 0) {
                return []
            }

            const booksIds = cart.items.map((item) => item.bookId)

            const cartItems = await db
                .select({
                    bookId: books.id,
                    cover: books.cover,
                    title: books.title,
                    price: books.price,
                })
                .from(books)
                .where(
                    and(eq(books.storeId, storeId), inArray(books.id, booksIds))
                )

            return cartItems.map((item) => ({
                ...item,
                quantity:
                    cart.items?.find((book) => book.bookId === item.bookId)
                        ?.quantity || 0,
            }))
        }),
})
