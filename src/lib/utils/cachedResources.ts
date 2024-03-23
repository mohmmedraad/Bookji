import { cache } from "react"
import { db } from "@/db"
import { stores as storesTable } from "@/db/schema"
import { currentUser } from "@clerk/nextjs"
import { and, eq } from "drizzle-orm"

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
