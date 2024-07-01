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
        console.log("getCachedUser")
        return await currentUser()
    } catch (err) {
        console.error(err)
        console.log("getCachedUser")
        return null
    }
})

export const getCachedStoreOrders = cache(async (storeId: number) => {
    return await db
        .select({
            month: sql<string>`DATE_TRUNC('month', ${ordersTable.createdAt})`,
            total: sql`SUM(${ordersTable.total})`.mapWith(Number),
            orders: sql`COUNT(*)`.mapWith(Number),
        })
        .from(ordersTable)
        .where(eq(ordersTable.storeId, storeId))
        .groupBy(sql`DATE_TRUNC('month', ${ordersTable.createdAt})`)
})

export const getBook = cache(async (bookSlug: string) => {
    const book = await db
        .select({
            id: booksTable.id,
            author: booksTable.author,
            cover: booksTable.cover,
            description: booksTable.description,
            title: booksTable.title,
            price: booksTable.price,
            storeId: booksTable.storeId,
            slug: booksTable.slug,
            storeName: storesTable.name,
            storeLogo: storesTable.logo,
        })
        .from(booksTable)
        .where(
            and(eq(booksTable.slug, bookSlug), eq(booksTable.isDeleted, false))
        )
        .innerJoin(
            storesTable,
            and(
                eq(storesTable.id, booksTable.storeId),
                eq(storesTable.isDeleted, false)
            )
        )

    console.log("book: ", book[0])

    return book[0] ? book[0] : undefined
})
