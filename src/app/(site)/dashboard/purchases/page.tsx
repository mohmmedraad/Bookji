import { type FC } from "react"
import { redirect } from "next/navigation"
import { getPurchases } from "@/server/utils"
import { type SearchParams } from "@/types"
import { currentUser } from "@clerk/nextjs"

import { searchParamsString } from "@/lib/utils"

import PurchasesTable from "./_components/PurchasesTable"

// import { DataTable } from "@/components/ui/DataTable"

// import { columns } from "@/components/MyBooksColumns"

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
