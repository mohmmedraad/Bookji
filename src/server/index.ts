import { db } from "@/db"
import { books } from "@/db/schema"
import { clerkClient } from "@clerk/nextjs/server"
import { wrap } from "@decs/typeschema"
import { TRPCError } from "@trpc/server"
import { asc, DrizzleError, eq, like } from "drizzle-orm"

import {
    extendedBookSchema,
    getBooksSchema,
    updateBookSchema,
} from "@/lib/validations/book"

import { privateProcedure, publicProcedure, router } from "./trpc"

const getUsersNames = async (userList: string[]) => {
    //@ts-expect-error clerk types are UserListParam but they are actually string[]
    const users = await clerkClient.users.getUserList(userList)
    const usersFullNames: Map<string, string> = new Map()

    users.forEach((user) =>
        usersFullNames.set(user.id, `${user.firstName} ${user.lastName}`)
    )
    return usersFullNames
}

const withUsers = async <T>(
    items: (T & { userId: string })[],
    usersIds: string[]
) => {
    const usersFullNames = await getUsersNames(usersIds)

    return items.map((item) => {
        return {
            ...item,
            userFullName: usersFullNames.get(item.userId),
        }
    })
}

export const appRouter = router({
    getBooks: publicProcedure
        .input(wrap(getBooksSchema))
        .query(async ({ input, ctx }) => {
            const { limit, cursor, searchBy, searchInput } = input

            if (!searchBy) {
                const foundBooks = await db.query.books.findMany({
                    limit,
                    offset: cursor || 0,
                    orderBy: (book) => [asc(book.createdAt)],
                })

                if (!foundBooks) {
                    return []
                }
                const usersIds = foundBooks.map((book) => book.userId)
                const books = withUsers(foundBooks, usersIds)
                return books
            }
            // if (searchBy === "title") {
            //     const foundBooks = await db.query.books.findMany({
            //         where: (book) => like(book.title, searchInput || ""),
            //         limit,
            //         offset,
            //         orderBy: (book) => [asc(book.createdAt)],
            //     })
            //     return foundBooks
            // }
            // if (searchBy === "tag") {
            //     const foundBooks = await db.query.books.findMany({
            //         where: (book ) => inArray(book.tags,  searchInput),
            //         limit,
            //         offset,
            //         orderBy: (book) => [asc(book.createdAt)],
            //     })
            //     return {
            //         message: "success",
            //         data: {
            //             books: foundBooks,
            //         },
            //     }
            // }
        }),
    addBook: privateProcedure
        .input(wrap(extendedBookSchema))
        .mutation(async ({ input, ctx }) => {
            try {
                const book = await db.insert(books).values({
                    ...input,
                    userId: ctx.userId,
                })

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
    updateBook: privateProcedure
        .input(wrap(updateBookSchema))
        .mutation(async ({ input, ctx }) => {
            const { id, ...values } = input
            try {
                const book = await db
                    .update(books)
                    .set(values)
                    .where(eq(books.id, id))

                return {
                    message: "success",
                    data: {
                        bookId: book.insertId,
                    },
                }
            } catch (error) {
                console.log(error)
                if (error instanceof DrizzleError) {
                    throw new TRPCError({ code: "BAD_REQUEST" })
                }
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
            }
        }),
})

export type AppRouter = typeof appRouter
