import { db } from "@/db"
import { carts, type Cart } from "@/db/schema"
import { type CartItem } from "@/types"
import { wrap } from "@decs/typeschema"
import { TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"

import {
    createCart,
    decreaseBookQuantity,
    getCart,
    isBookNotExists,
    updateCartBook,
} from "@/lib/utils/cart"
import { cartItemSchema } from "@/lib/validations/cart"

import { privateProcedure, router } from "../trpc"

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

        return cart.items
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
