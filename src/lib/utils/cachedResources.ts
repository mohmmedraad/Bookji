import { cache } from "react"
import { db } from "@/db"
import {
    books as booksTable,
    orders as ordersTable,
    stores as storesTable,
} from "@/db/schema"
import { currentUser } from "@clerk/nextjs"
import { and, eq, sql } from "drizzle-orm"

export const getCachedStore = cache(
    async (storeSlug: string, userId: string) => {
        const store = await db.query.stores.findFirst({
            columns: {
                id: true,
                slug: true,
                name: true,
                ownerId: true,
                logo: true,
                thumbnail: true,
                description: true,
                active: true,
            },
            where: and(
                eq(storesTable.ownerId, userId),
                eq(storesTable.slug, storeSlug),
                eq(storesTable.isDeleted, false)
            ),
        })

        return store
    }
)

export const getCachedUser = cache(async () => {
    try {
        return await currentUser()
    } catch (err) {
        console.error(err)
        return null
    }
})

export const getCachedStoreOrders = cache(async (storeId: number) => {
    return await db
        .select({
            month: sql<string>`MONTHNAME(${ordersTable.createdAt})`,
            total: sql`SUM(${ordersTable.total})`.mapWith(Number),
            orders: sql`COUNT(*)`.mapWith(Number),
        })
        .from(ordersTable)
        .where(eq(ordersTable.storeId, storeId))
        .groupBy(sql`MONTHNAME(${ordersTable.createdAt})`)
})

export const getBook = cache(async (bookSlug: string) => {
    const book = await db.query.books.findFirst({
        columns: {
            id: true,
            author: true,
            cover: true,
            description: true,
            title: true,
            price: true,
            storeId: true,
            slug: true,
        },
        where: and(
            eq(booksTable.slug, bookSlug),
            eq(booksTable.isDeleted, false)
        ),
    })

    return book
})
