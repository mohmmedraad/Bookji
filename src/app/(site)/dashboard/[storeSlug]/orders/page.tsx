import { type FC } from "react"
import { type Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { type SearchParams } from "@/types"

import { searchParamsString, title } from "@/lib/utils"
import { getCachedStore, getCachedUser } from "@/lib/utils/cachedResources"
import { getStoreOrders } from "@/lib/utils/store"

import OrdersTable from "./_components/OrdersTable"

interface pageProps {
    params: {
        storeSlug: string
    }
    searchParams: SearchParams
}

export const generateMetadata = async ({
    params: { storeSlug },
}: pageProps): Promise<Metadata | undefined> => {
    const user = await getCachedUser()

    if (!user || !user.id) {
        return
    }

    const store = await getCachedStore(storeSlug, user.id)

    if (!store) {
        return
    }

    return {
        title: "Orders",
        description: `Efficiently manage orders for your ${title(
            store.name
        )} orders on Bookji. Track shipments, process returns, and ensure customer satisfaction.`,
    }
}

const Page: FC<pageProps> = async ({ params: { storeSlug }, searchParams }) => {
    const user = await getCachedUser()
    if (!user) {
        return redirect(
            `/sign-in?_origin=/dashboard/${storeSlug}/orders?${searchParamsString(
                searchParams
            )}`
        )
    }

    const store = await getCachedStore(storeSlug, user.id)

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
