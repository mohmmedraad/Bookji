import { type FC } from "react"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { books, booksToCategories } from "@/db/schema"
import { type SearchParams } from "@/types"
import { currentUser } from "@clerk/nextjs"
import { and, asc, between, desc, exists, inArray, like } from "drizzle-orm"
import { parse } from "valibot"

import { booksSearchParamsSchema } from "@/lib/validations/params"
import { DataTable } from "@/components/ui/DataTable"

import { DataTableToolbar } from "./_components/DataTableToolbar"
import { Columns } from "./_components/StoreBooksColumns"

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
        sortBy: [column, order],
        categories,
        cost: { min, max },
    } = parse(booksSearchParamsSchema, searchParams)

    const user = await currentUser()

    const store = await db.query.stores.findFirst({
        columns: {
            id: true,
        },
        where: (store, { eq }) =>
            and(eq(store.ownerId, user!.id), eq(store.slug, storeSlug)),
    })

    if (!store) return notFound()
    const limit = 10

    const userBooks = await db.query.books.findMany({
        limit,
        offset: (page - 1) * limit,
        where: (book, { eq }) =>
            and(
                eq(book.userId, user!.id),
                eq(book.storeId, store.id),
                text ? like(book.title, `%${text}%`) : undefined,
                between(book.price, min.toString(), max.toString()),
                categories.length === 0
                    ? undefined
                    : exists(
                          db
                              .select({ id: booksToCategories.bookId })
                              .from(booksToCategories)
                              .where(
                                  and(
                                      eq(booksToCategories.bookId, book.id),
                                      inArray(
                                          booksToCategories.categoryId,
                                          categories
                                      )
                                  )
                              )
                      )
            ),
        orderBy: (book) =>
            column in books
                ? order === "asc"
                    ? //@ts-expect-error error
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                      asc(books[column])
                    : //@ts-expect-error error
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                      desc(books[column])
                : desc(books.createdAt),
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
