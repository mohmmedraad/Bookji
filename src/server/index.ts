import { db } from "@/db"
import { books } from "@/db/schema"
import { wrap } from "@decs/typeschema"
import { TRPCError } from "@trpc/server"
import { DrizzleError, eq } from "drizzle-orm"

import { extendedBookSchema, updateBookSchema } from "@/lib/validations/book"

import { privateProcedure, publicProcedure, router } from "./trpc"

export const appRouter = router({
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
