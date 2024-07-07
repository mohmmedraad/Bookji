import { db } from "@/db"
import {
    addresses as addressesTable,
    books as booksTable,
    booksToCategories,
    categories as categoriesTable,
    orderItems as orderItemsTable,
    orders as ordersTable,
    ratings as ratingsTable,
    stores as storesTable,
} from "@/db/schema"
import type { Customer, GetBooksSchema, SearchParams } from "@/types"
import { clerkClient } from "@clerk/nextjs/server"
import {
    and,
    asc,
    between,
    desc,
    eq,
    exists,
    inArray,
    like,
    max,
    sql,
    sum,
} from "drizzle-orm"
import { parse } from "valibot"

import { getCachedStoreOrders } from "@/lib/utils/cachedResources"
import {
    booksSearchParamsSchema,
    customersSearchParamsSchema,
    ordersSearchParamsSchema,
    purchasesSearchParamsSchema,
} from "@/lib/validations/params"

export async function isStoreExists(storeId: number, userId?: string) {
    const store = await db.query.stores.findFirst({
        columns: {
            id: true,
        },
        where: and(
            eq(storesTable.id, storeId),
            userId ? eq(storesTable.ownerId, userId) : undefined,
            eq(storesTable.isDeleted, false)
        ),
    })

    return store !== undefined
}

export async function getStoreOrders(
    userId: string,
    storeId: number,
    searchParams: SearchParams,
    limit = 10
) {
    const {
        text,
        page,
        city,
        country,
        email,
        state,
        sortBy: [column, orderBy],
        total: [minTotal, maxTotal],
        customers: customersUsernames,
    } = parse(ordersSearchParamsSchema, searchParams)

    const customers = new Map<string, { id: string } & Customer>()

    if (customersUsernames.length !== 0) {
        const { data: customersAccounts } = await clerkClient.users.getUserList(
            {
                username: customersUsernames,
            }
        )
        customersAccounts.forEach(
            ({ username, firstName, lastName, imageUrl, id }) => {
                customers.set(id, {
                    username,
                    firstName,
                    lastName,
                    imageUrl,
                    id,
                })
            }
        )
    }

    const orders = await db
        .select({
            customerId: ordersTable.userId,
            title: ordersTable.name,
            total: ordersTable.total,
            status: ordersTable.stripePaymentIntentStatus,
            addressId: ordersTable.addressId,
            storeId: ordersTable.storeId,
            email: ordersTable.email,
            city: addressesTable.city,
            state: addressesTable.state,
            items: sql<
                {
                    cover: string
                }[]
            >`json_agg(json_build_object('cover',${booksTable.cover}))`,
            country: addressesTable.country,
            createdAt: ordersTable.createdAt,
        })
        .from(ordersTable)
        .where((order) =>
            and(
                eq(order.storeId, storeId),
                customers.size !== 0
                    ? inArray(order.customerId, Array.from(customers.keys()))
                    : undefined,
                between(order.total, minTotal.toString(), maxTotal.toString()),
                text ? like(order.title, `%${text}%`) : undefined,
                email ? like(order.email, `%${email}%`) : undefined
            )
        )
        .innerJoin(addressesTable, eq(ordersTable.addressId, addressesTable.id))
        .innerJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.orderId))
        .leftJoin(
            booksTable,
            and(
                eq(orderItemsTable.bookId, booksTable.id),
                eq(booksTable.isDeleted, false)
            )
        )
        .groupBy(
            ordersTable.id,
            addressesTable.city,
            addressesTable.state,
            addressesTable.country
        )
        .having(
            and(
                city ? like(addressesTable.city, `%${city}%`) : undefined,
                state ? like(addressesTable.state, `%${state}%`) : undefined,
                country
                    ? like(addressesTable.country, `%${country}%`)
                    : undefined
            )
        )
        .orderBy((order) => {
            return column in order
                ? orderBy === "asc"
                    ? //@ts-expect-error error
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                      asc(order[column])
                    : //@ts-expect-error error
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                      desc(order[column])
                : desc(order.createdAt)
        })
        .limit(limit)
        .offset((page - 1) * limit)

    if (customers.size === 0) {
        const customersIds = [
            ...new Set(orders.map((order) => order.customerId)),
        ]

        const { data: customersAccounts } = await clerkClient.users.getUserList(
            {
                userId: customersIds,
            }
        )

        customersAccounts.forEach((customer) => {
            customers.set(customer.id, {
                id: customer.id,
                firstName: customer.firstName,
                lastName: customer.lastName,
                imageUrl: customer.imageUrl,
                username: customer.username,
            })
        })
    }

    const ordersWithCustomersMap = orders.map((order) => {
        const customer = customers.get(order.customerId)

        return {
            ...order,
            customer: customer
                ? {
                      firstName: customer.firstName,
                      lastName: customer.lastName,
                      imageUrl: customer.imageUrl,
                      username: customer.username,
                  }
                : undefined,
        }
    })

    return ordersWithCustomersMap
}

export async function getStoreBooks(
    userId: string,
    storeId: number,
    searchParams: SearchParams,
    limit = 10
) {
    const {
        text,
        page,
        sortBy: [column, order],
        categories,
        price: [minPrice, maxPrice],
        rating: [minRating, maxRating],
        inventory: [minInventory, maxInventory],
        orders: [minOrders, maxOrders],
    } = parse(booksSearchParamsSchema, searchParams)

    const books = await db
        .select({
            id: booksTable.id,
            title: booksTable.title,
            author: booksTable.author,
            slug: booksTable.slug,
            rating: sql<number>` CAST(AVG(COALESCE(${ratingsTable.rating}, 0)) AS DECIMAL(10,2)) `.mapWith(
                Number
            ),
            orders: sql<number>`COALESCE(SUM(${orderItemsTable.quantity}), 0)`,
            userId: booksTable.userId,
            storeId: booksTable.storeId,
            price: booksTable.price,
            description: booksTable.description,
            isDeleted: booksTable.isDeleted,
            cover: booksTable.cover,
            inventory: booksTable.inventory,
            createdAt: booksTable.createdAt,
            updatedAt: booksTable.updatedAt,
        })
        .from(booksTable)
        .where((book) =>
            and(
                eq(book.isDeleted, false),
                eq(book.userId, userId),
                eq(book.storeId, storeId),
                text ? like(book.title, `%${text}%`) : undefined,
                between(book.price, minPrice.toString(), maxPrice.toString()),
                // between(book.orders, minOrders, maxOrders),
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
        .leftJoin(ratingsTable, eq(booksTable.id, ratingsTable.bookId))
        .leftJoin(orderItemsTable, eq(booksTable.id, orderItemsTable.bookId))
        .groupBy(booksTable.id, booksTable.title)
        .having((book) =>
            and(
                between(book.rating, minRating, maxRating),
                between(book.orders, minOrders, maxOrders)
            )
        )
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
        .limit(limit)
        .offset((page - 1) * limit)

    return books
}

export async function getStoreCustomers(
    userId: string,
    storeId: number,
    searchParams: SearchParams,
    limit = 10
) {
    const {
        total_orders: [minOrders, maxOrders],
        total_spend: [minSpend, maxSpend],
        customers: customersUsernames,
        page,
        sortBy: [column, orderBy],
    } = parse(customersSearchParamsSchema, searchParams)

    const customers = new Map<
        string,
        { id: string; email: string } & Customer
    >()

    if (customersUsernames.length !== 0) {
        const { data: customersAccounts } = await clerkClient.users.getUserList(
            {
                username: customersUsernames,
            }
        )
        customersAccounts.forEach(
            ({
                username,
                firstName,
                lastName,
                imageUrl,
                id,
                emailAddresses,
            }) => {
                customers.set(id, {
                    username,
                    firstName,
                    lastName,
                    imageUrl,
                    id,
                    email: emailAddresses[0].emailAddress,
                })
            }
        )
    }

    const customersOrders = await db
        .select({
            totalOrders: sql<number>`COUNT(*)`.mapWith(Number),
            customerId: ordersTable.userId,
            totalSpend: sum(ordersTable.total),
            storeId: ordersTable.storeId,
            createdAt: max(ordersTable.createdAt),
        })
        .from(ordersTable)
        .where((customer) =>
            and(
                eq(customer.storeId, storeId),
                customers.size !== 0
                    ? inArray(customer.customerId, Array.from(customers.keys()))
                    : undefined
            )
        )
        .having((customer) =>
            and(
                between(
                    customer.totalSpend,
                    minSpend.toString(),
                    maxSpend.toString()
                ),
                between(
                    customer.totalOrders,
                    minOrders.toString(),
                    maxOrders.toString()
                )
            )
        )
        .groupBy(ordersTable.userId, ordersTable.storeId)
        .orderBy((order) => {
            return column in order
                ? orderBy === "asc"
                    ? //@ts-expect-error error
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                      asc(order[column])
                    : //@ts-expect-error error
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                      desc(order[column])
                : desc(order.createdAt)
        })
        .limit(limit)
        .offset((page - 1) * limit)

    if (customers.size === 0) {
        const customersIds = [
            ...new Set(customersOrders.map((order) => order.customerId)),
        ]

        const { data: customersAccounts } = await clerkClient.users.getUserList(
            {
                userId: customersIds,
            }
        )

        customersAccounts.forEach((customer) => {
            customers.set(customer.id, {
                id: customer.id,
                email: customer.emailAddresses[0].emailAddress,
                username: customer.username,
                firstName: customer.firstName,
                lastName: customer.lastName,
                imageUrl: customer.imageUrl,
            })
        })
    }

    const customersWithOrders = customersOrders.map((order) => {
        const customer = customers.get(order.customerId)

        return {
            ...order,
            customer: customer
                ? {
                      firstName: customer.firstName,
                      lastName: customer.lastName,
                      imageUrl: customer.imageUrl,
                      username: customer.username,
                      email: customer.email,
                  }
                : undefined,
        }
    })

    return customersWithOrders
}

export async function getPurchases(
    userId: string,
    searchParams: SearchParams,
    limit = 10
) {
    const {
        text,
        page,
        sortBy: [column, orderBy],
        total: [minTotal, maxTotal],
        stores,
    } = parse(purchasesSearchParamsSchema, searchParams)

    const orders = await db
        .select({
            userId: ordersTable.userId,

            storeName: storesTable.name,
            storeLogo: storesTable.logo,

            title: ordersTable.name,
            total: ordersTable.total,
            status: ordersTable.stripePaymentIntentStatus,

            items: sql<
                {
                    cover: string
                }[]
            >`json_agg(json_build_object('cover',${booksTable.cover}))`,
            createdAt: ordersTable.createdAt,
        })
        .from(ordersTable)
        .where((order) =>
            and(
                stores.length !== 0
                    ? inArray(order.storeName, stores)
                    : undefined,
                eq(order.userId, userId),
                between(order.total, minTotal.toString(), maxTotal.toString()),
                text ? like(order.title, `%${text}%`) : undefined
            )
        )
        .innerJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.orderId))
        .leftJoin(booksTable, eq(orderItemsTable.bookId, booksTable.id))
        .innerJoin(storesTable, eq(storesTable.id, ordersTable.storeId))
        .groupBy(ordersTable.id, storesTable.name, storesTable.logo)
        .orderBy((order) => {
            return column in order
                ? orderBy === "asc"
                    ? //@ts-expect-error error
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                      asc(order[column])
                    : //@ts-expect-error error
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                      desc(order[column])
                : desc(order.createdAt)
        })
        .limit(limit)
        .offset((page - 1) * limit)

    return orders
}

export async function getShopPageBooks({
    stores,
    limit = 10,
    author,
    text,
    categories,
    cursor = 0,
    price: [minPrice, maxPrice],
    rating: [minRating, maxRating],
    sortBy: [column, order],
}: GetBooksSchema) {
    const offset = cursor * limit

    const books = await db
        .select({
            id: booksTable.id,
            title: booksTable.title,
            slug: booksTable.slug,
            author: booksTable.author,
            rating: sql<number>` CAST(AVG(COALESCE(${ratingsTable.rating}, 0.0)) AS NUMERIC(10,2)) `.mapWith(
                Number
            ),
            isDeleted: booksTable.isDeleted,
            storeName: storesTable.name,
            storeId: booksTable.storeId,
            price: booksTable.price,
            cover: booksTable.cover,
            inventory: booksTable.inventory,
            createdAt: booksTable.createdAt,
        })
        .from(booksTable)
        .where((book) =>
            and(
                eq(book.isDeleted, false),
                text ? like(book.title, `%${text}%`) : undefined,
                author ? like(book.title, `%${author}%`) : undefined,
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
        .leftJoin(ratingsTable, eq(booksTable.id, ratingsTable.bookId))
        .innerJoin(
            storesTable,
            and(
                eq(booksTable.storeId, storesTable.id),
                eq(storesTable.isDeleted, false)
            )
        )
        .groupBy(booksTable.id, booksTable.title, storesTable.name)
        .having(
            between(
                sql` AVG(COALESCE(${ratingsTable.rating}, 0)) `,
                minRating,
                maxRating
            )
        )
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
        .limit(limit)
        .offset(offset)

    return books
}

export const getTotalCustomers = async (storeId: number) => {
    const totalCustomers = await db
        .select({
            count: sql<string>`COUNT(${ordersTable.userId})`,
        })
        .from(ordersTable)
        .where(eq(ordersTable.storeId, storeId))
        .groupBy(ordersTable.userId)

    return totalCustomers.length.toString()
}

export const getTotalSales = async (storeId: number) => {
    const storeOrders = await getCachedStoreOrders(storeId)

    return `${storeOrders
        .reduce((acc, { total }) => acc + total, 0)
        .toString()}$`
}

export const getTotalOrders = async (storeId: number) => {
    const storeOrders = await getCachedStoreOrders(storeId)

    return storeOrders.reduce((acc, { orders }) => acc + orders, 0).toString()
}
