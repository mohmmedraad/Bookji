import { db } from "@/db"
import {
    addresses as addressesTable,
    books as booksTable,
    booksToCategories,
    categories as categoriesTable,
    orderItems as orderItemsTable,
    orders as ordersTable,
    payments,
    ratings as ratingsTable,
    stores,
} from "@/db/schema"
import type { Customer, SearchParams, UserSubscriptionPlan } from "@/types"
import { clerkClient } from "@clerk/nextjs/server"
import { addDays } from "date-fns"
import {
    and,
    asc,
    between,
    count,
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

import { storeSubscriptionPlans } from "@/config/site"
import { stripe } from "@/lib/stripe"
import { userPrivateMetadataSchema } from "@/lib/validations/auth"
import {
    booksSearchParamsSchema,
    customersSearchParamsSchema,
    ordersSearchParamsSchema,
} from "@/lib/validations/params"

export async function deleteStore(id: number) {
    const { insertId } = await db
        .delete(booksTable)
        .where(eq(booksTable.id, id))
    return insertId
}

export async function deleteStoreBooks(storeId: number) {
    const { insertId } = await db
        .delete(booksTable)
        .where(eq(booksTable.storeId, storeId))
    return insertId
}

export async function deleteBookCategories(bookId: number) {
    const { insertId } = await db
        .delete(booksToCategories)
        .where(eq(booksToCategories.bookId, bookId))
    return insertId
}

export async function getStripeAccount(
    storeId: number,
    retrieveAccount = true
) {
    const falsyReturn = {
        isConnected: false,
        account: null,
        payment: null,
    }

    try {
        const store = await db.query.stores.findFirst({
            columns: {
                stripeAccountId: true,
            },
            where: eq(stores.id, storeId),
        })

        if (!store) return falsyReturn

        const payment = await db.query.payments.findFirst({
            columns: {
                stripeAccountId: true,
                detailsSubmitted: true,
            },
            where: eq(payments.storeId, storeId),
        })

        if (!payment || !payment.stripeAccountId) return falsyReturn

        if (!retrieveAccount)
            return {
                isConnected: true,
                account: null,
                payment,
            }

        const account = await stripe.accounts.retrieve(payment.stripeAccountId)

        if (!account) return falsyReturn

        // If the account details have been submitted, we update the store and payment records
        if (account.details_submitted && !payment.detailsSubmitted) {
            await db.transaction(async (tx) => {
                await tx
                    .update(payments)
                    .set({
                        detailsSubmitted: account.details_submitted,
                        stripeAccountCreatedAt: account.created,
                    })
                    .where(eq(payments.storeId, storeId))

                await tx
                    .update(stores)
                    .set({
                        stripeAccountId: account.id,
                        active: true,
                    })
                    .where(eq(stores.id, storeId))
            })
        }

        return {
            isConnected: payment.detailsSubmitted,
            account: account.details_submitted ? account : null,
            payment,
        }
    } catch (err) {
        err instanceof Error && console.error(err.message)
        return falsyReturn
    }
}

export async function createStripeAccount(
    payment: {
        stripeAccountId: string
        detailsSubmitted: boolean
    } | null,
    storeId: number
): Promise<string> {
    try {
        const account = await stripe.accounts.create({ type: "standard" })

        if (!account) {
            throw new Error("Error creating Stripe account.")
        }

        // If payment record exists, we update it with the new account id
        if (payment) {
            await db.update(payments).set({
                stripeAccountId: account.id,
            })
        } else {
            await db.insert(payments).values({
                storeId,
                stripeAccountId: account.id,
            })
        }

        return account.id
    } catch (error) {
        throw new Error("Error creating Stripe account.")
    }
}

export async function getSubscriptionPlan(
    userId: string
): Promise<UserSubscriptionPlan | null> {
    try {
        const user = await clerkClient.users.getUser(userId)

        if (!user) {
            throw new Error("User not found.")
        }

        const userPrivateMetadata = parse(
            userPrivateMetadataSchema,
            user.privateMetadata
        )

        const isSubscribed =
            !!userPrivateMetadata.stripePriceId &&
            !!userPrivateMetadata.stripeCurrentPeriodEnd &&
            addDays(
                new Date(userPrivateMetadata.stripeCurrentPeriodEnd),
                1
            ).getTime() > Date.now()

        const plan = isSubscribed
            ? storeSubscriptionPlans.find(
                  (plan) =>
                      plan.stripePriceId === userPrivateMetadata.stripePriceId
              )
            : storeSubscriptionPlans[0]

        if (!plan) {
            throw new Error("Plan not found.")
        }

        // Check if user has canceled subscription
        let isCanceled = false
        if (isSubscribed && !!userPrivateMetadata.stripeSubscriptionId) {
            const stripePlan = await stripe.subscriptions.retrieve(
                userPrivateMetadata.stripeSubscriptionId
            )
            isCanceled = stripePlan.cancel_at_period_end
        }

        return {
            ...plan,
            stripeSubscriptionId: userPrivateMetadata.stripeSubscriptionId,
            stripeCurrentPeriodEnd: userPrivateMetadata.stripeCurrentPeriodEnd,
            stripeCustomerId: userPrivateMetadata.stripeCustomerId,
            isSubscribed,
            isCanceled,
            isActive: isSubscribed && !isCanceled,
        }
    } catch (err) {
        console.error(err)
        return null
    }
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
        const customersAccounts = await clerkClient.users.getUserList({
            username: customersUsernames,
        })
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
            >`JSON_ARRAYAGG(
            JSON_OBJECT(
                'cover', ${booksTable.cover}
            ))`,
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
        .leftJoin(booksTable, eq(orderItemsTable.bookId, booksTable.id))
        .groupBy(ordersTable.id)
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

        const customersAccounts = await clerkClient.users.getUserList({
            userId: customersIds,
        })

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
            slug: booksTable.slug,
            rating: sql<number>` CAST(AVG(COALESCE(${ratingsTable.rating}, 0)) AS DECIMAL(10,2)) `.mapWith(
                Number
            ),
            orders: sql<number>`COALESCE(SUM(${orderItemsTable.quantity}), 0)`,
            userId: booksTable.userId,
            storeId: booksTable.storeId,
            price: booksTable.price,
            description: booksTable.description,
            cover: booksTable.cover,
            inventory: booksTable.inventory,
            createdAt: booksTable.createdAt,
            updatedAt: booksTable.updatedAt,
        })
        .from(booksTable)
        .where((book) =>
            and(
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
        place,
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
        const customersAccounts = await clerkClient.users.getUserList({
            username: customersUsernames,
        })
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
        .groupBy(ordersTable.userId)
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

        const customersAccounts = await clerkClient.users.getUserList({
            userId: customersIds,
        })

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
        console.log("customer emails: ", customer?.email)

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
