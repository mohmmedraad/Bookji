import { type FC } from "react"
import { redirect } from "next/navigation"
import { type SearchParams } from "@/types"
import { currentUser } from "@clerk/nextjs"

import { searchParamsString } from "@/lib/utils"
import { getPurchases } from "@/lib/utils/store"

import PurchasesTable from "./_components/PurchasesTable"

interface pageProps {
    searchParams: SearchParams
}

const page: FC<pageProps> = async ({ searchParams }) => {
    const user = await currentUser()

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
