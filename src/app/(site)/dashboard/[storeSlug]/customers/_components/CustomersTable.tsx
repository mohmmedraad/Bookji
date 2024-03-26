"use client"

import { useEffect, useState, type FC } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useStore } from "@/store/useStore"
import type { CustomerColumn } from "@/types"
import { toast } from "sonner"

import { useCustomersSearchParams } from "@/hooks/useCustomersSearchParams"
import { DataTable } from "@/components/ui/DataTable"
import { trpc } from "@/app/_trpc/client"

import { Columns } from "./CustomersColumns"
import { CustomersTableToolbar } from "./CustomersTableToolbar"

interface CustomersTableProps {
    initialCustomers: CustomerColumn[]
}

const CustomersTable: FC<CustomersTableProps> = ({ initialCustomers }) => {
    const searchParams = useCustomersSearchParams()
    const { id: storeId, slug: storeSlug } = useStore()
    const router = useRouter()
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const redirectSearchParams = useSearchParams()

    const {
        data: customers,
        isFetching,
        isFetchedAfterMount,
    } = trpc.store.customers.useQuery(
        {
            storeId,
            searchParams,
        },
        {
            skip: true,
            // @ts-expect-error unknown error
            initialData: initialCustomers,
            onError: (error) => {
                const errorCode = error?.data?.code
                if (errorCode === "UNAUTHORIZED") {
                    toast.error(
                        "You are not authorized to view this store's customers"
                    )
                    return router.push(
                        `/sign-in?_origin=/dashboard/${storeSlug}/customers?${redirectSearchParams.toString()}`
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
            data={customers}
            isFetching={isFetching}
            isInitialLoading={isInitialLoading}
            CustomDataTableToolbar={CustomersTableToolbar}
        />
    )
}

export default CustomersTable
