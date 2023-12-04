import { db } from "@/db"
import { books, carts, type Cart } from "@/db/schema"
import { type CartItem } from "@/types"
import { wrap } from "@decs/typeschema"
import { TRPCError } from "@trpc/server"
import { eq, inArray } from "drizzle-orm"

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

        if (!cart.items) {
            return []
        }

        const booksIds = cart.items.map((item) => +item.bookId)

        const cartItems = await db
            .select({
                bookId: books.id,
                cover: books.cover,
                title: books.title,
                price: books.price,
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

            const updatedCart = await addBookToCart(cart, input, ctx.userId)
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
})
