import { revalidatePath } from "next/cache"
import { db } from "@/db"
import {
    books as booksTable,
    booksToCategories,
    categories as categoriesTable,
    ratings as ratingsTable,
} from "@/db/schema"
import { wrap } from "@decs/typeschema"
import { TRPCError } from "@trpc/server"
import {
    and,
    asc,
    desc,
    eq,
    exists,
    inArray,
    ne,
    notInArray,
} from "drizzle-orm"
import { number, object } from "valibot"

import { slugify } from "@/lib/utils"
import {
    deleteBookSchema,
    extendedBookSchema,
    getBooksSchema,
    getRatingsSchema,
    getUserBooksSchema,
    rateBookSchema,
    updateBookSchema,
    userRatingSchema,
} from "@/lib/validations/book"

import { getShopPageBooks } from "../fetchers"
import { privateProcedure, publicProcedure, router } from "../trpc"
import { isBookExists, isInputEmpty, isStoreExists, withUsers } from "../utils"

export const booksRouter = router({
    get: publicProcedure
        .input(wrap(getBooksSchema))
        .query(async ({ input }) => {
            const books = await getShopPageBooks({ ...input })

            return books
        }),

    add: privateProcedure
        .input(wrap(extendedBookSchema))
        .mutation(async ({ input: { categories, ...input }, ctx }) => {
            if (!(await isStoreExists(input.storeId, ctx.user.id))) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Store not found",
                })
            }

            const bookWithSameTitle = await db.query.books.findFirst({
                columns: {
                    id: true,
                },
                where: and(
                    eq(booksTable.title, input.title),
                    eq(booksTable.isDeleted, false)
                ),
            })

            if (bookWithSameTitle) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Book with same title already exists",
                })
            }

            const book = await db.insert(booksTable).values({
                ...input,
                slug: slugify(input.title),
                userId: ctx.userId,
            })

            await db.insert(booksToCategories).values(
                categories.map((category) => ({
                    bookId: Number(book.insertId),
                    categoryId: category.id,
                }))
            )
        }),

    delete: privateProcedure
        .input(wrap(deleteBookSchema))
        .mutation(async ({ input }) => {
            const existingBooksIds = await isBookExists(input.booksIds)
            await db
                .update(booksTable)
                .set({ isDeleted: true, deletedAt: new Date() })
                .where(
                    and(
                        inArray(booksTable.id, existingBooksIds),
                        eq(booksTable.isDeleted, false)
                    )
                )
        }),

    update: privateProcedure
        .input(wrap(updateBookSchema))
        .mutation(async ({ input: { bookId, categories, ...input }, ctx }) => {
            if (!(await isBookExists(bookId, ctx.user.id))) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Book not found",
                })
            }

            if (input.title) {
                const bookWithSameTitle = await db.query.books.findFirst({
                    columns: {
                        id: true,
                    },
                    where: and(
                        eq(booksTable.title, input.title),
                        ne(booksTable.id, bookId),
                        eq(booksTable.isDeleted, false)
                    ),
                })

                if (bookWithSameTitle) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "Book with same title already exists",
                    })
                }
            }

            let slug: string = ""

            if (input.title) {
                slug = slugify(input.title)
                // @ts-expect-error slug dosnt exist in input
                input.slug = slug
            }
            console.log("categories: ", categories)

            if (categories) {
                await db
                    .delete(booksToCategories)
                    .where(eq(booksToCategories.bookId, bookId))

                await db.insert(booksToCategories).values(
                    categories.map((category) => ({
                        bookId,
                        categoryId: category.id,
                    }))
                )

            }
            if (isInputEmpty(input)) {
                return
            }

            await db
                .update(booksTable)
                .set({ ...input })
                .where(eq(booksTable.id, bookId))
        }),

    bookCategories: privateProcedure
        .input(
            wrap(
                object({
                    bookId: number(),
                })
            )
        )
        .query(async ({ input }) => {
            if (!(await isBookExists(input.bookId))) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Book not found",
                })
            }

            try {
                const foundCategories = await db
                    .select({
                        id: categoriesTable.id,
                        name: categoriesTable.name,
                    })
                    .from(categoriesTable)
                    .where(
                        exists(
                            db
                                .select({ id: booksToCategories.bookId })
                                .from(booksToCategories)
                                .where(
                                    and(
                                        eq(
                                            booksToCategories.bookId,
                                            input.bookId
                                        ),
                                        eq(
                                            booksToCategories.categoryId,
                                            categoriesTable.id
                                        )
                                    )
                                )
                        )
                    )
                return foundCategories
            } catch (error) {
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
            }
        }),

    categories: publicProcedure.query(async () => {
        try {
            const foundCategories = await db
                .select({
                    id: categoriesTable.id,
                    name: categoriesTable.name,
                })
                .from(categoriesTable)
            return foundCategories
        } catch (error) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
        }
    }),

    rate: privateProcedure
        .input(wrap(rateBookSchema))
        .mutation(async ({ input, ctx }) => {
            const { bookId, rating, comment } = input
            if (!(await isBookExists(bookId))) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Book not found",
                })
            }

            const isUserAlreadyRateBook = await db.query.ratings.findFirst({
                columns: {
                    id: true,
                },
                where: (rate) =>
                    and(eq(rate.bookId, bookId), eq(rate.userId, ctx.userId)),
            })

            if (isUserAlreadyRateBook) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "You already rate this book",
                })
            }

            const rate = await db.insert(ratingsTable).values({
                bookId,
                userId: ctx.userId,
                rating,
                comment,
            })

            revalidatePath("/")

            return {
                message: "success",
                data: {
                    rateId: rate.insertId,
                },
            }
        }),

    userRating: privateProcedure
        .input(wrap(userRatingSchema))
        .query(async ({ input, ctx }) => {
            if (!(await isBookExists(input.bookId))) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Book not found",
                })
            }
            const userRating = await db.query.ratings.findFirst({
                columns: {
                    rating: true,
                },
                where: (rate) =>
                    and(
                        eq(rate.bookId, input.bookId),
                        eq(rate.userId, ctx.userId)
                    ),
            })

            if (!userRating) {
                return null
            }
            return { rating: userRating.rating }
        }),

    bookRating: publicProcedure
        .input(wrap(userRatingSchema))
        .query(async ({ input }) => {
            if (!(await isBookExists(input.bookId))) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Book not found",
                })
            }
            const bookRating = await db.query.ratings.findMany({
                columns: {
                    rating: true,
                },
                where: (rate) => eq(rate.bookId, input.bookId),
            })

            if (!bookRating) {
                return null
            }
            return bookRating
        }),

    reviews: publicProcedure
        .input(wrap(getRatingsSchema))
        .query(async ({ input }) => {
            const { limit, cursor, bookId } = input
            const offset = (cursor || 0) * limit
            if (!(await isBookExists(bookId))) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Book not found",
                })
            }

            const foundRatings = await db.query.ratings.findMany({
                limit,
                offset,
                columns: {
                    rating: true,
                    userId: true,
                    comment: true,
                },
                where: (rating) => eq(rating.bookId, bookId),
                orderBy: (rating) => [desc(rating.createdAt)],
            })

            if (!foundRatings) {
                return []
            }
            const ratings = await withUsers(foundRatings)
            return ratings
        }),

    store: publicProcedure
        .input(wrap(getUserBooksSchema))
        .query(async ({ input }) => {
            const { limit, cursor, storeId, excludedBooks } = input
            const offset = (cursor || 0) * limit

            if (!(await isStoreExists(storeId))) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Store not found",
                })
            }

            const foundBooks = await db.query.books.findMany({
                limit,
                offset,
                columns: {
                    id: true,
                    title: true,
                    cover: true,
                    author: true,
                },
                where: (book) =>
                    and(
                        eq(book.storeId, storeId),
                        excludedBooks.length === 0
                            ? undefined
                            : notInArray(book.id, excludedBooks)
                    ),
                orderBy: (book) => [asc(book.createdAt)],
            })

            return foundBooks

            if (!foundBooks) {
                return []
            }
        }),
})