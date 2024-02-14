import { db } from "@/db"
import { books, booksToCategories, ratings, stores } from "@/db/schema"
import { wrap } from "@decs/typeschema"
import { TRPCError } from "@trpc/server"
import { and, eq, inArray } from "drizzle-orm"
import { number, object, partial, string } from "valibot"

import { slugify } from "@/lib/utils"
import {
    deleteStoreSchema,
    newStoreSchema,
    updateStoreSchema,
} from "@/lib/validations/store"

import { privateProcedure, router } from "../trpc"
import { deleteStoreBooks } from "../utils"

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

                const deleteBooks = await Promise.all([
                    db.delete(stores).where(eq(stores.id, store.id)),
                    db.delete(books).where(eq(books.storeId, storeId)),
                    db.delete(ratings).where(inArray(ratings.bookId, booksIds)),
                    db
                        .delete(booksToCategories)
                        .where(inArray(booksToCategories.bookId, booksIds)),
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
})
