import { type FC } from "react"
import { type Metadata } from "next"
import { redirect } from "next/navigation"
import { type SearchParams } from "@/types"

import { searchParamsString } from "@/lib/utils"
import { getCachedUser } from "@/lib/utils/cachedResources"
import { getPurchases } from "@/lib/utils/store"

import PurchasesTable from "./_components/PurchasesTable"

interface pageProps {
    searchParams: SearchParams
}

export const metadata: Metadata = {
    title: "Purchases",
    description:
        "View and manage your book purchases on Bookji. Access your order history, track shipments, and explore new reads.",
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
