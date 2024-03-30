import { type FC } from "react"
import { type Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { type SearchParams } from "@/types"
import { parse } from "valibot"

import { searchParamsString, title } from "@/lib/utils"
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
        title: "Customers",
        description: `Analyze customer data and insights for ${title(
            store.name
        )} store. Optimize marketing strategies and enhance customer experience.`,
    }
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
