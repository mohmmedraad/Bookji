import { type FC } from "react"
import { notFound, redirect } from "next/navigation"
import { db } from "@/db"
import { addresses as addressesTable, orders as ordersTable } from "@/db/schema"
import { type SearchParams } from "@/types"
import { currentUser } from "@clerk/nextjs"
import { and, asc, between, desc, eq, like } from "drizzle-orm"
import { parse } from "valibot"

import { ordersSearchParamsSchema } from "@/lib/validations/params"
import { DataTable } from "@/components/ui/DataTable"

import { Columns } from "./_components/OrdersColumns"
import { OrdersDataTableToolbar } from "./_components/OrdersDataTableToolbar"

interface pageProps {
    params: {
        storeSlug: string
    }
    searchParams: SearchParams
}

const Page: FC<pageProps> = async ({ params: { storeSlug }, searchParams }) => {
    const {
        text,
        page,
        city,
        country,
        email,
        state,
        sortBy: [column, orderBy],
        total: [minTotal, maxTotal],
    } = parse(ordersSearchParamsSchema, searchParams)

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
    const limit = 10

    const orders = await db
        .select({
            title: ordersTable.name,
            total: ordersTable.total,
            status: ordersTable.stripePaymentIntentStatus,
            addressId: ordersTable.addressId,
            storeId: ordersTable.storeId,
            email: ordersTable.email,
            city: addressesTable.city,
            state: addressesTable.state,
            country: addressesTable.country,
            createdAt: ordersTable.createdAt,
        })
        .from(ordersTable)
        .where((order) =>
            and(
                eq(order.storeId, store.id),
                between(order.total, minTotal.toString(), maxTotal.toString()),
                text ? like(order.title, `%${text}%`) : undefined,
                email ? like(order.email, `%${email}%`) : undefined
            )
        )
        .innerJoin(addressesTable, eq(ordersTable.addressId, addressesTable.id))
        .groupBy(ordersTable.id)
        .having(
            and(
                city ? like(addressesTable.city, `%${city}%`) : undefined,
                state ? like(addressesTable.state, `%${state}%`) : undefined,
                country
                    ? like(addressesTable.country, `%${country}%`)
                    : undefined
            )
        )
        .orderBy((order) => {
            return column in order
                ? orderBy === "asc"
                    ? //@ts-expect-error error
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                      asc(order[column])
                    : //@ts-expect-error error
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                      desc(order[column])
                : desc(order.createdAt)
        })
        .limit(limit)
        .offset((page - 1) * limit)

    return (
        <>
            <DataTable
                // @ts-expect-error unknown error
                columns={Columns}
                data={orders}
                currentPage={page}
                CustomDataTableToolbar={OrdersDataTableToolbar}
            />
        </>
    )
}

export default Page
