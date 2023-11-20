import { db } from "@/db"
import { books, type Book } from "@/db/schema"
import { clerkClient } from "@clerk/nextjs/server"
import { wrap } from "@decs/typeschema"
import { TRPCError } from "@trpc/server"
import { and, asc, DrizzleError, eq, like } from "drizzle-orm"

import {
    extendedBookSchema,
    getBooksSchema,
    updateBookSchema,
} from "@/lib/validations/book"

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
            const { limit, cursor, searchBy } = input
            const offset = (cursor || 0) * limit
            console.log("input: ", input)
            // if (!searchBy) {
            const foundBooks = await db.query.books.findMany({
                limit,
                offset,
                where: (book) =>
                    // and(
                    like(book.title, `%${searchBy.text}%`),
                // eq(book.userId, searchBy.userId)
                // ),
                orderBy: (book) => [asc(book.createdAt)],
            })

            console.log("books: ", foundBooks)

            if (!foundBooks) {
                console.log("no book to show")
                return null
            }
            const books = await withUsers(foundBooks)
            return books

            // if (searchBy.category === "all") return books
            // /**
            //  * TODO: handle if the category is a list
            //  */
            // return books.filter(
            //     (book) => book.tags?.includes(searchBy.category)
            // )
        }),

    addBook: privateProcedure
        .input(wrap(extendedBookSchema))
        .mutation(async ({ input, ctx }) => {
            console.log("inputs: ", input)
            try {
                const book = await db.insert(books).values({
                    ...input,
                    userId: ctx.userId,
                })

                console.log("book added")

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
        .mutation(async ({ input }) => {
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
