import { revalidatePath } from "next/cache"
import { db } from "@/db"
import {
    books,
    booksToCategories,
    categories as categoriesTable,
    ratings as ratingsTable,
    stores as storesTable,
} from "@/db/schema"
import { clerkClient } from "@clerk/nextjs/server"
import { wrap } from "@decs/typeschema"
import { TRPCError } from "@trpc/server"
import {
    and,
    asc,
    between,
    desc,
    eq,
    exists,
    inArray,
    like,
    notInArray,
    sql,
} from "drizzle-orm"
import { number, object } from "valibot"

import { slugify } from "@/lib/utils"
import {
    extendedBookSchema,
    getBooksSchema,
    getRatingsSchema,
    getUserBooksSchema,
    rateBookSchema,
    userRatingSchema,
} from "@/lib/validations/book"
import { booksSearchParamsSchema } from "@/lib/validations/params"

import { cartRouter } from "./routers/cart"
import { storeRouter } from "./routers/store"
import { stripeRouter } from "./routers/stripe"
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
            const {
                stores,
                limit,
                cursor,
                page,
                text,
                categories,
                price: [minPrice, maxPrice],
                rating: [minRating, maxRating],
                sortBy: [column, order],
            } = input

            const offset = cursor * limit

            const foundBooks = await db
                .select({
                    id: books.id,
                    title: books.title,
                    slug: books.slug,
                    rating: sql<number>` CAST(AVG(COALESCE(${ratingsTable.rating}, 0)) AS DECIMAL(10,2)) `.mapWith(
                        Number
                    ),
                    storeName: storesTable.name,
                    userId: books.userId,
                    storeId: books.storeId,
                    price: books.price,
                    description: books.description,
                    cover: books.cover,
                    inventory: books.inventory,
                    createdAt: books.createdAt,
                    updatedAt: books.updatedAt,
                })
                .from(books)
                .where((book) =>
                    and(
                        text ? like(book.title, `%${text}%`) : undefined,
                        between(
                            book.price,
                            minPrice.toString(),
                            maxPrice.toString()
                        ),
                        stores.length === 0
                            ? undefined
                            : inArray(book.storeName, stores),
                        categories.length === 0
                            ? undefined
                            : exists(
                                  db
                                      .select({
                                          bookId: booksToCategories.bookId,
                                          categoryId:
                                              booksToCategories.categoryId,
                                      })
                                      .from(booksToCategories)
                                      .where((category) =>
                                          and(
                                              eq(category.bookId, book.id),
                                              exists(
                                                  db
                                                      .select({
                                                          name: categoriesTable.name,
                                                          id: categoriesTable.id,
                                                      })
                                                      .from(categoriesTable)
                                                      .where((categoryT) =>
                                                          and(
                                                              eq(
                                                                  categoryT.id,
                                                                  category.categoryId
                                                              ),
                                                              inArray(
                                                                  categoryT.name,
                                                                  categories
                                                              )
                                                          )
                                                      )
                                              )
                                          )
                                      )
                              )
                    )
                )
                .leftJoin(ratingsTable, eq(books.id, ratingsTable.bookId))
                .innerJoin(storesTable, eq(books.storeId, storesTable.id))
                .groupBy(books.id, books.title)
                .having(
                    between(
                        sql` AVG(COALESCE(${ratingsTable.rating}, 0)) `,
                        minRating,
                        maxRating
                    )
                )
                .orderBy((book) => {
                    return column in book
                        ? order === "asc"
                            ? //@ts-expect-error error
                              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                              asc(book[column])
                            : //@ts-expect-error error
                              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                              desc(book[column])
                        : desc(book.createdAt)
                })
                .limit(limit)
                .offset(offset)

            // const foundBooks = await db.query.books.findMany({
            //     limit,
            //     offset,
            //     columns: {
            //         id: true,
            //         userId: true,
            //         title: true,
            //         cover: true,
            //         slug: true,
            //     },
            //     where: (book) =>
            //         and(
            //             like(book.title, `%${text}%`),
            //             // userId
            //             //     ? eq(book.userId, userId)
            //             //     : undefined,
            //             between(
            //                 book.price,
            //                 minPrice.toString(),
            //                 maxPrice.toString()
            //             ),
            //             categories.length === 0
            //                 ? undefined
            //                 : exists(
            //                       db
            //                           .select({ id: booksToCategories.bookId })
            //                           .from(booksToCategories)
            //                           .where(
            //                               and(
            //                                   eq(
            //                                       booksToCategories.bookId,
            //                                       book.id
            //                                   ),
            //                                   inArray(
            //                                       booksToCategories.categoryId,
            //                                       categories.map(
            //                                           (category) => 1
            //                                       )
            //                                   )
            //                               )
            //                           )
            //                   )
            //         ),
            //     orderBy: (book) => [asc(book.createdAt)],
            // })

            if (!foundBooks) {
                return null
            }
            return await withUsers(foundBooks)
            // return books
        }),

    addBook: privateProcedure
        .input(wrap(extendedBookSchema))
        .mutation(async ({ input: { categories, ...input }, ctx }) => {
            const bookWithSameTitle = await db.query.books.findFirst({
                where: eq(books.title, input.title),
            })

            if (bookWithSameTitle) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Book with same title already exists",
                })
            }
            const book = await db.insert(books).values({
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

            return {
                message: "success",
                data: {
                    bookId: book.insertId,
                },
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
    getBookCategories: privateProcedure
        .input(
            wrap(
                object({
                    bookId: number(),
                })
            )
        )
        .query(async ({ input, ctx }) => {
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
    getAllCategories: publicProcedure.query(async () => {
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
                orderBy: (rating) => [desc(rating.createdAt)],
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
    cart: cartRouter,
    store: storeRouter,
    stripe: stripeRouter,
})

export type AppRouter = typeof appRouter
