import { type FC } from "react"
import { redirect } from "next/navigation"
import { type SearchParams } from "@/types"

import { searchParamsString } from "@/lib/utils"
import { getPurchases } from "@/lib/utils/store"

import PurchasesTable from "./_components/PurchasesTable"
import { getCachedUser } from "@/lib/utils/cachedResources"

interface pageProps {
    searchParams: SearchParams
}

const page: FC<pageProps> = async ({ searchParams }) => {
    const user = await getCachedUser()

    if (!user) {
        return redirect(
            `/sign-in?_origin=/dashboard/purchases?${searchParamsString(
                searchParams
            )}`
        )
    }

    const orders = await getPurchases(user.id, searchParams)

    return <PurchasesTable initialOrders={orders} />
}

export default page
