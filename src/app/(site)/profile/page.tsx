import { type FC } from "react"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { currentUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"

import { getCurrentPageNumber } from "@/lib/utils"
import { DataTable } from "@/components/ui/DataTable"
import { Columns } from "@/components/MyBooksColumns"

interface pageProps {
    searchParams: {
        _page: string | undefined
    }
}

const Page: FC<pageProps> = async ({ searchParams }) => {
    const currentPage = getCurrentPageNumber(searchParams?._page)
    const user = await currentUser()
    if (!user || !user.id) {
        return
    }

    const userBooks = await db.query.books.findMany({
        offset: currentPage * 10,
        limit: 10,
        where: (book) => eq(book.userId, user.id),
    })
    return (
        <>
            {/**
             * TODO: Add suspense
             */}
            <DataTable
                columns={Columns}
                data={userBooks}
                url="/profile"
                currentPage={currentPage}
            />
        </>
    )
}

export default Page
