import { db } from "@/db"
import {
    books,
    booksToCategories,
    cartItems,
    ratings,
    stores,
} from "@/db/schema"
import { clerkClient } from "@clerk/nextjs/server"
import { wrap } from "@decs/typeschema"
import { TRPCError } from "@trpc/server"
import { and, eq, inArray, like } from "drizzle-orm"
import { number, object, string, ValiError } from "valibot"

import { stripe } from "@/lib/stripe"
import { slugify } from "@/lib/utils"
import {
    deleteStoreSchema,
    newStoreSchema,
    storeResourcesSchema,
    updateStoreSchema,
} from "@/lib/validations/store"

import { privateProcedure, publicProcedure, router } from "../trpc"
import { getStoreBooks, getStoreCustomers, getStoreOrders } from "../utils"

export const storeRouter = router({
    create: privateProcedure
        .input(wrap(newStoreSchema))
        .mutation(async ({ ctx, input }) => {
            const { name, description, logo, thumbnail } = input
            const storeWithSameName = await db.query.stores.findFirst({
                where: eq(stores.name, name),
            })

            if (storeWithSameName) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Store with same name already exists",
                })
            }

            const store = await db.insert(stores).values({
                name,
                description,
                logo,
                thumbnail,
                ownerId: ctx.user.id,
                slug: slugify(name),
            })

            return store.insertId
        }),

    update: privateProcedure
        .input(wrap(updateStoreSchema))
        .mutation(async ({ input: { storeId, ...input }, ctx }) => {
            const isStoreNotExists = !(await db.query.stores.findFirst({
                where: and(
                    eq(stores.id, storeId),
                    eq(stores.ownerId, ctx.user.id)
                ),
            }))
            if (isStoreNotExists) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Store not found",
                })
            }

            if (input.name) {
                const storeWithSameName = await db.query.stores.findFirst({
                    where: eq(stores.name, input.name),
                })

                if (storeWithSameName) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "A store with same name already exists",
                    })
                }
            }
            let slug: string = ""

            if (input.name) {
                slug = slugify(input.name)
                // @ts-expect-error slug dosnt exist in input
                input.slug = slug
            }
            await db.update(stores).set(input).where(eq(stores.id, storeId))

            return slug
        }),

    delete: privateProcedure
        .input(wrap(deleteStoreSchema))
        .mutation(async ({ input: { storeId }, ctx }) => {
            try {
                const store = await db.query.stores.findFirst({
                    columns: {
                        id: true,
                        stripeAccountId: true,
                    },
                    where: and(
                        eq(stores.id, storeId),
                        eq(stores.ownerId, ctx.user.id)
                    ),
                })

                if (!store) {
                    return new TRPCError({
                        code: "NOT_FOUND",
                        message: "Store not found",
                    })
                }

                const storeBooks = await db.query.books.findMany({
                    columns: {
                        id: true,
                    },
                    where: (book) => eq(book.storeId, storeId),
                })

                if (storeBooks.length === 0) {
                    await db.delete(stores).where(eq(stores.id, store.id))
                    return
                }

                const booksIds = storeBooks.map((book) => book.id)

                const deleteStore = await Promise.all([
                    db.delete(stores).where(eq(stores.id, store.id)),
                    db.delete(books).where(eq(books.storeId, storeId)),
                    db.delete(ratings).where(inArray(ratings.bookId, booksIds)),
                    db
                        .delete(booksToCategories)
                        .where(inArray(booksToCategories.bookId, booksIds)),
                    db.delete(cartItems).where(eq(cartItems.storeId, store.id)),
                    store.stripeAccountId &&
                        stripe.accounts.del(store.stripeAccountId),
                ])
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Something went wrong",
                })
            }
        }),

    getStoreInfo: privateProcedure
        .input(
            wrap(
                object({
                    storeId: number(),
                })
            )
        )
        .query(async ({ input }) => {
            const store = await db.query.stores.findFirst({
                columns: {
                    name: true,
                    logo: true,
                },
                where: eq(stores.id, input.storeId),
            })

            if (!store) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Store not found",
                })
            }

            return store
        }),

    orders: privateProcedure
        .input(wrap(storeResourcesSchema))
        .query(async ({ input, ctx }) => {
            const store = await db.query.stores.findFirst({
                columns: {
                    id: true,
                },
                where: (store, { eq }) =>
                    and(
                        eq(store.ownerId, ctx.user.id),
                        eq(store.id, input.storeId)
                    ),
            })

            if (!store) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Store not found",
                })
            }
            try {
                const orders = await getStoreOrders(ctx.user.id, store.id, {
                    ...input.searchParams,
                })
                return orders
            } catch (error) {
                if (error instanceof ValiError) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Invalid search parameters.",
                    })
                }
            }
        }),

    books: privateProcedure
        .input(wrap(storeResourcesSchema))
        .query(async ({ input, ctx }) => {
            const store = await db.query.stores.findFirst({
                columns: {
                    id: true,
                },
                where: (store, { eq }) =>
                    and(
                        eq(store.ownerId, ctx.user.id),
                        eq(store.id, input.storeId)
                    ),
            })

            if (!store) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Store not found",
                })
            }
            try {
                const books = await getStoreBooks(ctx.user.id, store.id, {
                    ...input.searchParams,
                })
                return books
            } catch (error) {
                if (error instanceof ValiError) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Invalid search parameters.",
                    })
                }
            }
        }),

    customers: privateProcedure
        .input(wrap(storeResourcesSchema))
        .query(async ({ input, ctx }) => {
            const store = await db.query.stores.findFirst({
                columns: {
                    id: true,
                },
                where: (store, { eq }) =>
                    and(
                        eq(store.ownerId, ctx.user.id),
                        eq(store.id, input.storeId)
                    ),
            })

            if (!store) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Store not found",
                })
            }
            try {
                const customers = await getStoreCustomers(
                    ctx.user.id,
                    store.id,
                    {
                        ...input.searchParams,
                    }
                )
                return customers
            } catch (error) {
                if (error instanceof ValiError) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Invalid search parameters.",
                    })
                }
            }
        }),

    customersInfo: privateProcedure
        .input(
            wrap(
                object({
                    storeId: number(),
                })
            )
        )
        .query(async ({ input, ctx }) => {
            const store = await db.query.stores.findFirst({
                columns: {
                    id: true,
                },
                where: (store, { eq }) =>
                    and(
                        eq(store.ownerId, ctx.user.id),
                        eq(store.id, input.storeId)
                    ),
            })

            if (!store) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Store not found",
                })
            }
            const customersIds = await db.query.orders.findMany({
                columns: {
                    userId: true,
                },
                where: (order) => eq(order.storeId, store.id),
            })

            if (customersIds.length === 0) {
                return []
            }

            const customersInfo = await clerkClient.users.getUserList({
                // remove duplicates from userIds
                userId: [
                    ...new Set(customersIds.map((customer) => customer.userId)),
                ],
            })

            if (customersInfo.length === 0) {
                return []
            }

            const customers = customersInfo.map((customer) => {
                return {
                    username: customer.username,
                    firstName: customer.firstName,
                    lastName: customer.lastName,
                    imageUrl: customer.imageUrl,
                }
            })

            return customers
        }),

    getStores: publicProcedure
        .input(
            wrap(
                object({
                    searchValue: string(),
                })
            )
        )
        .query(async ({ input }) => {
            const stores = await db.query.stores.findMany({
                columns: {
                    id: true,
                    name: true,
                    logo: true,
                    slug: true,
                },
                where: (store) => like(store.name, `%${input.searchValue}%`),
            })

            return stores
        }),
})
