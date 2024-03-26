"use client"

import { useEffect, useState, type FC } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { type PurchasesColumn } from "@/types"
import { toast } from "sonner"

import { usePurchasesSearchParams } from "@/hooks/usePurchasesSearchParams"
import { DataTable } from "@/components/ui/DataTable"
import { trpc } from "@/app/_trpc/client"

import { Columns } from "./PurchasesColumns"
import { PurchasesDataTableToolbar } from "./PurchasesDataTableToolbar"

interface PurchasesTableProps {
    initialOrders: PurchasesColumn[]
}

const PurchasesTable: FC<PurchasesTableProps> = ({ initialOrders }) => {
    const searchParams = usePurchasesSearchParams()
    const router = useRouter()
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const redirectSearchParams = useSearchParams()

    const {
        data: orders,
        isFetching,
        isFetchedAfterMount,
    } = trpc.users.userOrders.useQuery(
        {
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
                        "You are not authorized to view this store's purchases"
                    )
                    return router.push(
                        `/sign-in?_origin=/dashboard/purchases?${redirectSearchParams.toString()}`
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
            CustomDataTableToolbar={PurchasesDataTableToolbar}
        />
    )
}

export default PurchasesTable
