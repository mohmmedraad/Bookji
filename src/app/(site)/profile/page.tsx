import { type FC } from "react"

import { books } from "@/config/site"
import { getCurrentPageNumber } from "@/lib/utils"
import { DataTable } from "@/components/ui/DataTable"
import { Columns } from "@/components/MyBooksColumns"

interface pageProps {
    searchParams: {
        _page: string | undefined
    }
}

const Page: FC<pageProps> = ({ searchParams }) => {
    const currentPage = getCurrentPageNumber(searchParams?._page)
    return (
        <>
        {/**
             * TODO: Add suspense 
             */}
            <DataTable
                columns={Columns}
                data={books}
                url="/profile"
                currentPage={currentPage}
            />
        </>
    )
}

export default Page
