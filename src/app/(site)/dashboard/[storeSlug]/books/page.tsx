import { type FC } from "react"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { currentUser } from "@clerk/nextjs"
import { and } from "drizzle-orm"

import { DataTable } from "@/components/ui/DataTable"

import { DataTableToolbar } from "./_components/DataTableToolbar"
import { Columns } from "./_components/StoreBooksColumns"

interface pageProps {
    params: {
        storeSlug: string
    }
}

const Page: FC<pageProps> = async ({ params: { storeSlug } }) => {
    const user = await currentUser()

    const store = await db.query.stores.findFirst({
        columns: {
            id: true,
        },
        where: (store, { eq }) =>
            and(eq(store.ownerId, user!.id), eq(store.slug, storeSlug)),
    })

    if (!store) return notFound()

    const userBooks = await db.query.books.findMany({
        where: (book, { eq }) =>
            and(eq(book.userId, user!.id), eq(book.storeId, store.id)),
    })

    return (
        <DataTable
            columns={Columns}
            data={userBooks}
            url="/profile"
            currentPage={1}
            withPagination={false}
            CustomDataTableToolbar={DataTableToolbar}
        />
    )
}

export default Page
