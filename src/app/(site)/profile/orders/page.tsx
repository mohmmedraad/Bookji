import { type FC } from "react"

import { orders } from "@/config/site"
import { getCurrentPageNumber } from "@/lib/utils"
import { DataTable } from "@/components/ui/DataTable"
import { Columns } from "@/components/OrdersColumns"

interface pageProps {
    searchParams: {
        _page: string | undefined
    }
}

const Page: FC<pageProps> = ({ searchParams }) => {
    const currentPage = getCurrentPageNumber(searchParams?._page)
    return (
        <>
            <DataTable
                columns={Columns}
                data={orders}
                url="/orders"
                currentPage={currentPage}
            />
        </>
    )
}

export default Page
