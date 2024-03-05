import { type FC } from "react"
import { notFound, redirect } from "next/navigation"
import { db } from "@/db"
import { getStoreCustomers } from "@/server/utils"
import { type SearchParams } from "@/types"
import { currentUser } from "@clerk/nextjs"
import { and } from "drizzle-orm"
import { parse } from "valibot"

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

    const user = await currentUser()
    if (!user) {
        const userSearchParams = []
        for (const key in searchParams) {
            userSearchParams.push(
                `${key}=${searchParams[key]?.toString() || ""}`
            )
        }
        return redirect(
            `/sign-in?_origin=/dashboard/${storeSlug}/orders?${userSearchParams.join(
                "&"
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
