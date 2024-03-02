"use client"

import { useEffect, useState, type FC } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { type OrderColumns } from "@/types"
import { toast } from "sonner"

import { useOrdersSearchParams } from "@/hooks/useOrdersSearchParams"
import { useStore } from "@/hooks/useStore"
import { DataTable } from "@/components/ui/DataTable"
import { trpc } from "@/app/_trpc/client"

import { Columns } from "./OrdersColumns"
import { OrdersDataTableToolbar } from "./OrdersDataTableToolbar"

interface OrdersTableProps {
    initialOrders: OrderColumns
}

const OrdersTable: FC<OrdersTableProps> = ({ initialOrders }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { handleClearSearch, ...searchParams } = useOrdersSearchParams()
    const { id: storeId, slug: storeSlug } = useStore()
    const router = useRouter()
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const redirectSearchParams = useSearchParams()

    const {
        data: orders,
        isFetching,
        isFetchedAfterMount,
    } = trpc.store.orders.useQuery(
        {
            storeId,
            searchParams,
        },
        {
            skip: true,
            // @ts-expect-error unknown error
            initialData: initialOrders,
            onError: (error) => {
                const errorCode = error?.data?.code
                if (errorCode === "UNAUTHORIZED") {
                    toast.error(
                        "You are not authorized to view this store's orders"
                    )
                    return router.push(
                        `/sign-in?_origin=/dashboard/${storeSlug}?${redirectSearchParams.toString()}`
                    )
                }
                if (errorCode === "NOT_FOUND") {
                    toast.error("Store not found")
                    return router.push("/dashboard")
                }
            },
        }
    )

    useEffect(() => {
        if (!isFetchedAfterMount) return
        setIsInitialLoading(false)
    }, [isFetchedAfterMount])

    return (
        <DataTable
            columns={Columns}
            // @ts-expect-error unknown error
            data={orders}
            isFetching={isFetching}
            isInitialLoading={isInitialLoading}
            currentPage={searchParams.page}
            CustomDataTableToolbar={OrdersDataTableToolbar}
        />
    )
}

export default OrdersTable
