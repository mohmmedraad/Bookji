import { type FC } from "react"
import { notFound, redirect } from "next/navigation"
import { db } from "@/db"
import { getStoreOrders } from "@/server/fetchers"
import { type SearchParams } from "@/types"
import { currentUser } from "@clerk/nextjs"
import { and } from "drizzle-orm"

import { searchParamsString } from "@/lib/utils"

import OrdersTable from "./_components/OrdersTable"

interface pageProps {
    params: {
        storeSlug: string
    }
    searchParams: SearchParams
}

const Page: FC<pageProps> = async ({ params: { storeSlug }, searchParams }) => {
    const user = await currentUser()
    if (!user) {
        return redirect(
            `/sign-in?_origin=/dashboard/${storeSlug}/orders?${searchParamsString(
                searchParams
            )}`
        )
    }

    const store = await db.query.stores.findFirst({
        columns: {
            id: true,
        },
        where: (store, { eq }) =>
            and(eq(store.ownerId, user.id), eq(store.slug, storeSlug)),
    })

    if (!store) return notFound()

    const orders = await getStoreOrders(user.id, store.id, {
        ...searchParams,
    })

    return (
        <>
            <OrdersTable initialOrders={orders} />
        </>
    )
}

export default Page
