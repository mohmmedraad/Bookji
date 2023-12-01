import { db } from "@/db"
import { books, booksToCategories, categories, ratings } from "@/db/schema"
import { type PartialBook } from "@/types"
import { clerkClient } from "@clerk/nextjs/server"
import { wrap } from "@decs/typeschema"
import { TRPCError } from "@trpc/server"
import {
    and,
    asc,
    between,
    eq,
    exists,
    inArray,
    like,
    notInArray,
} from "drizzle-orm"

import {
    extendedBookSchema,
    getBooksSchema,
    getRatingsSchema,
    getUserBooksSchema,
    rateBookSchema,
    userRatingSchema,
} from "@/lib/validations/book"

import { privateProcedure, publicProcedure, router } from "./trpc"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dynamic = "force-dynamic"

const getUsers = async (userList: string[]) => {
    //@ts-expect-error clerk types are UserListParam but they are actually string[]
    const users = await clerkClient.users.getUserList(userList)
    const usersFullNames: Map<string, string> = new Map()

    users.forEach((user) => {
        usersFullNames.set(user.id, `${user.firstName} ${user.lastName}`)
        usersFullNames.set(user.id + "-img", user.imageUrl)
    })
    return usersFullNames
}

const getUser = async (userId: string) => {
    const user = await clerkClient.users.getUser(userId)
    return user
}

export const withUsers = async <T extends { userId: string }>(list: T[]) => {
    const usersIds = getUsersIds(list)
    const usersFullNames = await getUsers(usersIds)

    return list.map((item) => {
        return {
            ...item,
            userFullName: usersFullNames.get(item.userId),
            userImg: usersFullNames.get(item.userId + "-img"),
        }
    })
}

const getUsersIds = <T extends { userId: string }>(list: T[]) => {
    return list.map((item) => item.userId)
}

export const appRouter = router({
    getBooks: publicProcedure
        .input(wrap(getBooksSchema))
        .query(async ({ input }) => {
            const { limit, cursor, searchParams } = input
            const offset = (cursor || 0) * limit

            const foundBooks = await db.query.books.findMany({
                limit,
                offset,
                columns: {
                    id: true,
                    userId: true,
                    title: true,
                    cover: true,
                },
                where: (book) =>
                    and(
                        like(book.title, `%${searchParams.text}%`),
                        searchParams.userId
                            ? eq(book.userId, searchParams.userId)
                            : undefined,
                        between(
                            book.price,
                            searchParams.cost.min.toString(),
                            searchParams.cost.max.toString()
                        ),
                        searchParams.categories.length === 0
                            ? undefined
                            : exists(
                                  db
                                      .select({ id: booksToCategories.bookId })
                                      .from(booksToCategories)
                                      .where(
                                          and(
                                              eq(
                                                  booksToCategories.bookId,
                                                  book.id
                                              ),
                                              inArray(
                                                  booksToCategories.categoryId,
                                                  searchParams.categories
                                              )
                                          )
                                      )
                              )
                    ),
                orderBy: (book) => [asc(book.createdAt)],
            })

            if (!foundBooks) {
                return null
            }
            const books = await withUsers(foundBooks)
            return books
        }),

    addBook: privateProcedure
        .input(wrap(extendedBookSchema))
        .mutation(async ({ input: { categories, ...input }, ctx }) => {
            try {
                const book = await db.insert(books).values({
                    ...input,
                    userId: ctx.userId,
                })

                await db.insert(booksToCategories).values(
                    categories.map((category) => ({
                        bookId: Number(book.insertId),
                        categoryId: category.id,
                    }))
                )

                return {
                    message: "success",
                    data: {
                        bookId: book.insertId,
                    },
                }
            } catch (error) {
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
            }
        }),

    // updateBook: privateProcedure
    //     .input(wrap(updateBookSchema))
    //     .mutation(async ({ input }) => {
    //         const { id, ...values } = input
    //         try {
    //             const book = await db
    //                 .update(books)
    //                 .set(values)
    //                 .where(eq(books.id, id))

    //             return {
    //                 message: "success",
    //                 data: {
    //                     bookId: book.insertId,
    //                 },
    //             }
    //         } catch (error) {
    //             if (error instanceof DrizzleError) {
    //                 throw new TRPCError({ code: "BAD_REQUEST" })
    //             }
    //             throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
    //         }
    //     }),
    getAllCategories: publicProcedure.query(async () => {
        try {
            const foundCategories = await db
                .select({
                    id: categories.id,
                    name: categories.name,
                })
                .from(categories)
            return foundCategories
        } catch (error) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
        }
    }),

    rateBook: privateProcedure
        .input(wrap(rateBookSchema))
        .mutation(async ({ input, ctx }) => {
            const { bookId, rating, comment } = input
            const isBookExists = await db.query.books.findFirst({
                columns: {
                    id: true,
                },
                where: (book) => eq(book.id, +bookId),
            })

            if (!isBookExists) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
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

            const rate = await db.insert(ratings).values({
                bookId,
                userId: ctx.userId,
                rating,
                comment,
            })

            return {
                message: "success",
                data: {
                    rateId: rate.insertId,
                },
            }
        }),

    getUserRating: privateProcedure
        .input(wrap(userRatingSchema))
        .query(async ({ input, ctx }) => {
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

    getBookRating: publicProcedure
        .input(wrap(userRatingSchema))
        .query(async ({ input }) => {
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

    getRatings: publicProcedure
        .input(wrap(getRatingsSchema))
        .query(async ({ input }) => {
            const { limit, cursor, bookId } = input
            const offset = (cursor || 0) * limit

            const foundRatings = await db.query.ratings.findMany({
                limit,
                offset,
                columns: {
                    rating: true,
                    userId: true,
                    comment: true,
                },
                where: (rating) => eq(rating.bookId, bookId),
                orderBy: (rating) => [asc(rating.createdAt)],
            })

            if (!foundRatings) {
                return []
            }
            const ratings = await withUsers(foundRatings)
            return ratings
        }),

    getUserBooks: publicProcedure
        .input(wrap(getUserBooksSchema))
        .query(async ({ input }) => {
            const { limit, cursor, userId, excludedBooks } = input
            const offset = (cursor || 0) * limit
            console.log("input: ", input)

            const foundBooks = await db.query.books.findMany({
                limit,
                offset,
                columns: {
                    id: true,
                    userId: true,
                    title: true,
                    cover: true,
                },
                where: (book) =>
                    and(
                        eq(book.userId, userId),
                        excludedBooks.length === 0
                            ? undefined
                            : notInArray(book.id, excludedBooks)
                    ),
                orderBy: (book) => [asc(book.createdAt)],
            })

            if (!foundBooks) {
                return []
            }
            const user = await getUser(userId)
            const ratings = foundBooks.map((book) => ({
                ...book,
                userFullName: `${user.firstName} ${user.lastName}`,
                userImg: user.imageUrl,
            }))
            return ratings
        }),
})

export type AppRouter = typeof appRouter
