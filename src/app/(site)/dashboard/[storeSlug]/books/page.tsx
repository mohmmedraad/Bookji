import { type FC } from "react"
import { notFound } from "next/navigation"
import { db } from "@/db"
import {
    books,
    booksToCategories,
    categories as categoriesTable,
    ratings as ratingsTable,
} from "@/db/schema"
import { type SearchParams } from "@/types"
import { currentUser } from "@clerk/nextjs"
import {
    and,
    asc,
    between,
    desc,
    eq,
    exists,
    inArray,
    like,
    sql,
} from "drizzle-orm"
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
        price: [minPrice, maxPrice],
        rating: [minRating, maxRating],
        inventory: [minInventory, maxInventory],
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

    const userBooks = await db
        .select({
            id: books.id,
            title: books.title,
            slug: books.slug,
            rating: sql<number>` cast(AVG(${ratingsTable.rating}) AS DECIMAL(10,2)) `.mapWith(
                Number
            ),
            userId: books.userId,
            storeId: books.storeId,
            price: books.price,
            description: books.description,
            cover: books.cover,
            inventory: books.inventory,
            createdAt: books.createdAt,
            updatedAt: books.updatedAt,
        })
        .from(books)
        .where((book) =>
            and(
                eq(book.userId, user!.id),
                eq(book.storeId, store.id),
                text ? like(book.title, `%${text}%`) : undefined,
                between(book.price, minPrice.toString(), maxPrice.toString()),
                between(book.inventory, minInventory, maxInventory),
                categories.length === 0
                    ? undefined
                    : exists(
                          db
                              .select({
                                  bookId: booksToCategories.bookId,
                                  categoryId: booksToCategories.categoryId,
                              })
                              .from(booksToCategories)
                              .where((category) =>
                                  and(
                                      eq(category.bookId, book.id),
                                      exists(
                                          db
                                              .select({
                                                  name: categoriesTable.name,
                                                  id: categoriesTable.id,
                                              })
                                              .from(categoriesTable)
                                              .where((categoryT) =>
                                                  and(
                                                      eq(
                                                          categoryT.id,
                                                          category.categoryId
                                                      ),
                                                      inArray(
                                                          categoryT.name,
                                                          categories
                                                      )
                                                  )
                                              )
                                      )
                                  )
                              )
                      )
            )
        )
        .innerJoin(ratingsTable, eq(books.id, ratingsTable.bookId))
        .groupBy(books.id, books.title)
        .having(between(sql`AVG(${ratingsTable.rating})`, minRating, maxRating))
        .orderBy((book) => {
            console.log(column in books)
            return column in book
                ? order === "asc"
                    ? //@ts-expect-error error
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                      asc(book[column])
                    : //@ts-expect-error error
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                      desc(book[column])
                : desc(book.createdAt)
        })
        .limit(limit)
        .offset((page - 1) * limit)

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
