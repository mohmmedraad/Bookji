import { type FC } from "react"
import { db } from "@/db"
import {
    books,
    booksToCategories,
    categories as categoriesTable,
    ratings as ratingsTable,
    stores as storesTable,
} from "@/db/schema"
import { withUsers } from "@/server"
import type { SearchParams } from "@/types"
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

import { getBooksSchema } from "@/lib/validations/book"
import Container from "@/components/ui/Container"

import BooksFeed from "./_sections/BooksFeed"
import FilterBar from "./_sections/FilterBar"

interface PageProps {
    searchParams: SearchParams
}

const Page: FC<PageProps> = async ({ searchParams }) => {
    const {
        text,
        page,
        sortBy: [column, order],
        categories,
        price: [minPrice, maxPrice],
        rating: [minRating, maxRating],
        stores,
    } = parse(getBooksSchema, searchParams)

    console.log(
        page,
        column,
        order,
        categories,
        minPrice,
        maxPrice,
        minRating,
        maxRating,
        stores
    )

    const offset = (page - 1) * 10

    const foundBooks = await db
        .select({
            id: books.id,
            title: books.title,
            slug: books.slug,
            rating: sql<number>` cast(AVG(${ratingsTable.rating}) AS DECIMAL(10,2)) `.mapWith(
                Number
            ),
            storeName: storesTable.name,
            userId: books.userId,
            storeId: books.storeId,
            price: books.price,
            cover: books.cover,
            createdAt: books.createdAt,
        })
        .from(books)
        .where((book) =>
            and(
                text ? like(book.title, `%${text}%`) : undefined,
                between(book.price, minPrice.toString(), maxPrice.toString()),
                stores.length === 0
                    ? undefined
                    : inArray(book.storeName, stores),
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
        .innerJoin(storesTable, eq(books.storeId, storesTable.id))
        .groupBy(books.id, books.title)
        .having(between(sql`AVG(${ratingsTable.rating})`, minRating, maxRating))
        .orderBy((book) => {
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
        .limit(10)
        .offset(offset)

    const initialBooks = await withUsers(foundBooks)
    return (
        <main className="min-h-screen pb-8 pt-32">
            <Container>
                <FilterBar />
                <BooksFeed initialBooks={initialBooks} />
            </Container>
        </main>
    )
}

export default Page
