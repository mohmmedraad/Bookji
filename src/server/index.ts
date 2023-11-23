import { db } from "@/db"
import { books, booksToCategories, categories, type Book } from "@/db/schema"
import { clerkClient } from "@clerk/nextjs/server"
import { wrap } from "@decs/typeschema"
import { TRPCError } from "@trpc/server"
import { and, asc, between, eq, inArray, like } from "drizzle-orm"

import { extendedBookSchema, getBooksSchema } from "@/lib/validations/book"

import { privateProcedure, publicProcedure, router } from "./trpc"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dynamic = "force-dynamic"

const getUsersNames = async (userList: string[]) => {
    //@ts-expect-error clerk types are UserListParam but they are actually string[]
    const users = await clerkClient.users.getUserList(userList)
    const usersFullNames: Map<string, string> = new Map()

    users.forEach((user) =>
        usersFullNames.set(user.id, `${user.firstName} ${user.lastName}`)
    )
    return usersFullNames
}

export const withUsers = async (bookList: Book[]) => {
    const usersIds = getUsersIds(bookList)
    const usersFullNames = await getUsersNames(usersIds)

    return bookList.map((item) => {
        return {
            ...item,
            userFullName: usersFullNames.get(item.userId),
        }
    })
}

const getUsersIds = (bookList: Book[]) => {
    return bookList.map((book) => book.userId)
}

export const appRouter = router({
    getBooks: publicProcedure
        .input(wrap(getBooksSchema))
        .query(async ({ input }) => {
            const { limit, cursor, searchParams } = input
            const offset = (cursor || 0) * limit
            console.log("input: ", input)
            const foundBooks = await db.query.books.findMany({
                limit,
                offset,
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
                        )
                    ),
                with: {
                    categories: {
                        where: (category) =>
                            inArray(
                                category.categoryId,
                                searchParams.categories || undefined
                            ),
                    },
                },
                orderBy: (book) => [asc(book.createdAt)],
            })

            if (!foundBooks) {
                console.log("no book to show")
                return null
            }
            const books = await withUsers(foundBooks)
            return books

            console.log("books: ", books)
            console.log("#######################################")
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
                console.log("error: ", error)
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
    //             console.log(error)
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
            console.log(error)
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
        }
    }),
})

export type AppRouter = typeof appRouter
