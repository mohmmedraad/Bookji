import { type FC } from "react"
import { notFound, redirect } from "next/navigation"
import { type SearchParams } from "@/types"
import { parse } from "valibot"

import { searchParamsString } from "@/lib/utils"
import { getCachedStore, getCachedUser } from "@/lib/utils/cachedResources"
import { getStoreCustomers } from "@/lib/utils/store"
import { customersSearchParamsSchema } from "@/lib/validations/params"

import CustomersTable from "./_components/CustomersTable"

interface pageProps {
    params: {
        storeSlug: string
    }
    searchParams: SearchParams
}

const Page: FC<pageProps> = async ({ params: { storeSlug }, searchParams }) => {
    const ordersSearchParams = parse(customersSearchParamsSchema, searchParams)

    const user = await getCachedUser()
    if (!user) {
        redirect(
            `/sign-in?_origin=/dashboard/${storeSlug}/customers?${searchParamsString(
                searchParams
            )}`
        )
    }

    const store = await getCachedStore(storeSlug, user.id)

    if (!store) return notFound()
    // @ts-expect-error unknown error
    const orders = await getStoreCustomers(user.id, store.id, {
        ...ordersSearchParams,
    })

    return (
        <>
            <CustomersTable initialCustomers={orders} />
        </>
    )
}

export default Page
