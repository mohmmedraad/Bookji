import { type FC } from "react"
import { type Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { BadgeDollarSign, UserPlus, Wallet } from "lucide-react"

import { title } from "@/lib/utils"
import { getCachedStore, getCachedUser } from "@/lib/utils/cachedResources"
import {
    getStoreOrders,
    getTotalCustomers,
    getTotalOrders,
    getTotalSales,
} from "@/lib/utils/store"
import { getSubscriptionPlan } from "@/lib/utils/subscription"
import Book from "@/components/ui/BookCover"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card"
import { DataTable } from "@/components/ui/DataTable"
import { Icons } from "@/components/Icons"

import { Columns } from "../orders/_components/OrdersColumns"
import Charts from "./_components/Charts"
import TrendingArrow from "./_components/TrendingArrow"

interface pageProps {
    params: {
        storeSlug: string
    }
}
const cards = [
    {
        Icon: UserPlus,
        title: "Total customers",
        getValue: getTotalCustomers,
        status: "up",
        percent: "15%",
    },
    {
        Icon: Wallet,
        title: "Total revenue",
        getValue: getTotalSales,
        status: "down",
        percent: "40%",
    },
    {
        Icon: BadgeDollarSign,
        title: "Total sales",
        getValue: getTotalSales,
        status: "up",
        percent: "33%",
    },
    {
        Icon: Wallet,
        title: "Total orders",
        getValue: getTotalOrders,

        status: "up",
        percent: "80%",
    },
]

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
        title: "Analytics",
        description: `Get detailed analytics and performance metrics for ${title(
            store.name
        )} store. Make informed decisions to grow your business.`,
    }
}

const page: FC<pageProps> = async ({ params: { storeSlug } }) => {
    const user = await getCachedUser()

    if (!user) {
        return redirect(`/sign-in?_origin=/dashboard/${storeSlug}/analytics`)
    }

    const subscriptionPlan = await getSubscriptionPlan(user.id)

    if (!subscriptionPlan || !subscriptionPlan.analytics) {
        return redirect(`/dashboard/billing`)
    }

    const store = await getCachedStore(storeSlug, user.id)

    if (!store) return notFound()

    const orders = await getStoreOrders(user.id, store.id, {})

    return (
        <div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {cards.map(
                    async ({ title, Icon, getValue, status, percent }) => (
                        <Card key={title}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <div className="rounded-md border-1 border-slate-200 p-3 ">
                                        <Icon className="h-6 w-6 text-[#344054]" />
                                    </div>
                                    {title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center gap-4">
                                <div className="flex items-start gap-2">
                                    <span className="text-4xl text-[#101828]">
                                        {await getValue(store.id)}
                                    </span>
                                    <TrendingArrow
                                        status={status}
                                        percent={percent}
                                        // className="absolute right-2 top-0"
                                    />
                                </div>
                                {status === "up" ? (
                                    <Icons.UpChart />
                                ) : (
                                    <Icons.DownChart />
                                )}
                            </CardContent>
                        </Card>
                    )
                )}
            </div>
            <Charts storeSlug={storeSlug} />
            <div className="mt-10 grid items-start gap-8 md:grid-cols-analytics">
                <Card className="overflow-x-hidden">
                    <CardHeader>
                        <CardTitle>Recent Order</CardTitle>
                        <CardDescription>
                            Last ten orders in your store
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <DataTable
                            columns={Columns}
                            data={orders}
                            withPagination={false}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top books</CardTitle>
                        <CardDescription>
                            Top three sale books in your store
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center gap-3">
                        {[1, 2, 3].map((num) => (
                            <Book
                                key={num}
                                className="aspect-[2/3] w-full md:w-24"
                                height={115}
                                src={`/Book-${num}.webp`}
                                alt="book"
                                width={89}
                            />
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default page
