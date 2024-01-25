import { type FC } from "react"
import { db } from "@/db"
import { currentUser } from "@clerk/nextjs"

import { DataTable } from "@/components/ui/DataTable"

import { Columns } from "./_components/StoreBooksColumns"

interface pageProps {
    params: {
        storeId: string
    }
}

const Page: FC<pageProps> = async ({ params: { storeId } }) => {
    const user = await currentUser()
    const userBooks = await db.query.books.findMany({
        where: (book, { eq }) => eq(book.userId, user!.id),
    })
    return (
        <DataTable
            columns={Columns}
            data={userBooks}
            url="/profile"
            currentPage={1}
            withPagination={false}
        />
    )
}

export default Page
