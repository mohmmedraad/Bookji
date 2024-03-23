import { type FC } from "react"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { orders as ordersTable } from "@/db/schema"
import { eq, sql } from "drizzle-orm"

import { getCachedStore, getCachedUser } from "@/lib/utils/cachedResources"

import SalesChart from "./SalesChart"

interface ChartsProps {
    storeSlug: string
}

const Charts: FC<ChartsProps> = async ({ storeSlug }) => {
    const user = await getCachedUser()

    if (!user) return

    const store = await getCachedStore(storeSlug, user.id)

    if (!store) return notFound()

    const chartOrders = await db
        .select({
            month: sql<string>`MONTHNAME(${ordersTable.createdAt})`,
            total: sql`SUM(${ordersTable.total})`.mapWith(Number),
            orders: sql`COUNT(*)`.mapWith(Number),
        })
        .from(ordersTable)
        .where(eq(ordersTable.storeId, store.id))
        .groupBy(sql`MONTHNAME(${ordersTable.createdAt})`)

    const data = chartOrders.flatMap(({ month, total, orders }) => [
        { month, name: "total", value: total },
        { month, name: "orders", value: orders },
    ])

    return <SalesChart data={data} />
}

export default Charts
