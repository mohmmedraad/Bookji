import { db } from "@/db"
import { stores } from "@/db/schema"
import { clerkClient } from "@clerk/nextjs/server"
import { wrap } from "@decs/typeschema"
import { TRPCError } from "@trpc/server"
import { and, eq, like, ne } from "drizzle-orm"
import { number, object, string, ValiError } from "valibot"

import { slugify } from "@/lib/utils"
import {
    deleteStoreSchema,
    newStoreSchema,
    storeResourcesSchema,
    updateStoreSchema,
} from "@/lib/validations/store"

import { getStoreBooks, getStoreCustomers, getStoreOrders } from "../fetchers"
import { privateProcedure, publicProcedure, router } from "../trpc"
import { isStoreExists } from "../utils"

export const storeRouter = router({
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
                where: (store) =>
                    and(
                        like(store.name, `%${input.searchValue}%`),
                        eq(store.isDeleted, false)
                    ),
            })

            return stores
        }),
    create: privateProcedure
        .input(wrap(newStoreSchema))
        .mutation(async ({ ctx, input }) => {
            const { name, description, logo, thumbnail } = input
            const storeWithSameName = await db.query.stores.findFirst({
                where: and(eq(stores.name, name), eq(stores.isDeleted, false)),
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
            if (!(await isStoreExists(storeId, ctx.user.id))) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Store not found",
                })
            }

            if (input.name) {
                const storeWithSameName = await db.query.stores.findFirst({
                    where: and(
                        eq(stores.name, input.name),
                        ne(stores.id, storeId),
                        eq(stores.isDeleted, false)
                    ),
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
                if (!(await isStoreExists(storeId, ctx.user.id))) {
                    return new TRPCError({
                        code: "NOT_FOUND",
                        message: "Store not found",
                    })
                }

                await db
                    .update(stores)
                    .set({ isDeleted: true, deletedAt: new Date() })
                    .where(eq(stores.id, storeId))
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Something went wrong",
                })
            }
        }),

    storeInfo: privateProcedure
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
                where: and(
                    eq(stores.id, input.storeId),
                    eq(stores.isDeleted, false)
                ),
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
        .query(async ({ input: { storeId, searchParams }, ctx }) => {
            if (!(await isStoreExists(storeId, ctx.user.id))) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Store not found",
                })
            }
            try {
                const orders = await getStoreOrders(ctx.user.id, storeId, {
                    ...searchParams,
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
        .query(async ({ input: { storeId, searchParams }, ctx }) => {
            if (!(await isStoreExists(storeId, ctx.user.id))) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Store not found",
                })
            }
            try {
                const books = await getStoreBooks(ctx.user.id, storeId, {
                    ...searchParams,
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
        .query(async ({ input: { storeId, searchParams }, ctx }) => {
            if (!(await isStoreExists(storeId, ctx.user.id))) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Store not found",
                })
            }
            try {
                const customers = await getStoreCustomers(
                    ctx.user.id,
                    storeId,
                    {
                        ...searchParams,
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
        .query(async ({ input: { storeId }, ctx }) => {
            if (!(await isStoreExists(storeId, ctx.user.id))) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Store not found",
                })
            }
            const customersIds = await db.query.orders.findMany({
                columns: {
                    userId: true,
                },
                where: (order) => eq(order.storeId, storeId),
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
})
