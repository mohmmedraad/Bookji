import { db } from "@/db"
import { cartItems as cartItemsTable } from "@/db/schema"
import { wrap } from "@decs/typeschema"
import { TRPCError } from "@trpc/server"
import { and, eq } from "drizzle-orm"
import { number, object } from "valibot"

import { isBookExists } from "@/lib/utils/book"
import { createCart, getCart, isCartExist } from "@/lib/utils/cart"
import { cartItemSchema } from "@/lib/validations/cart"

import { privateProcedure, router } from "../trpc"

export const cartRouter = router({
    get: privateProcedure.query(async ({ ctx }) => {
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
                await createCart(ctx.userId, [input])
                return
            }

            const isItemAlreadyExist = await db.query.cartItems.findFirst({
                columns: {
                    id: true,
                    quantity: true,
                },
                where: and(
                    eq(cartItemsTable.cartId, cart.id),
                    eq(cartItemsTable.bookId, input.bookId)
                ),
            })

            if (isItemAlreadyExist) {
                await db
                    .update(cartItemsTable)
                    .set({
                        quantity: isItemAlreadyExist.quantity + 1,
                    })
                    .where(eq(cartItemsTable.id, isItemAlreadyExist.id))
                return
            }

            await db.insert(cartItemsTable).values({
                storeId: input.storeId,
                bookId: input.bookId,
                cartId: cart.id,
            })

            return
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

            if (input.quantity <= 0) {
                await db
                    .delete(cartItemsTable)
                    .where(
                        and(
                            eq(cartItemsTable.cartId, cart.id),
                            eq(cartItemsTable.bookId, input.bookId)
                        )
                    )
                return
            }

            await db
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

            return
        }),
})
