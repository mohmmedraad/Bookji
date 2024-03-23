import { type FC } from "react"
import { notFound } from "next/navigation"

import {
    getCachedStore,
    getCachedStoreOrders,
    getCachedUser,
} from "@/lib/utils/cachedResources"

import SalesChart from "./SalesChart"

interface ChartsProps {
    storeSlug: string
}

const Charts: FC<ChartsProps> = async ({ storeSlug }) => {
    const user = await getCachedUser()

    if (!user) return

    const store = await getCachedStore(storeSlug, user.id)

    if (!store) return notFound()

    const chartOrders = await getCachedStoreOrders(store.id)

    const data = chartOrders.flatMap(({ month, total, orders }) => [
        { month, name: "total", value: total },
        { month, name: "orders", value: orders },
    ])

    return <SalesChart data={data} />
}

export default Charts
