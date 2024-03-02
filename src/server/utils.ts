import { db } from "@/db"
import {
    addresses as addressesTable,
    books,
    booksToCategories,
    orders as ordersTable,
    payments,
    stores,
} from "@/db/schema"
import { SearchParams, type UserSubscriptionPlan } from "@/types"
import { clerkClient } from "@clerk/nextjs"
import { addDays } from "date-fns"
import { and, asc, between, desc, eq, like } from "drizzle-orm"
import { parse } from "valibot"

import { storeSubscriptionPlans } from "@/config/site"
import { stripe } from "@/lib/stripe"
import { userPrivateMetadataSchema } from "@/lib/validations/auth"
import { ordersSearchParamsSchema } from "@/lib/validations/params"

export async function deleteStore(id: number) {
    const { insertId } = await db.delete(books).where(eq(books.id, id))
    return insertId
}

export async function deleteStoreBooks(storeId: number) {
    const { insertId } = await db
        .delete(books)
        .where(eq(books.storeId, storeId))
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

export async function getOrders(
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
    } = parse(ordersSearchParamsSchema, searchParams)

    const orders = await db
        .select({
            title: ordersTable.name,
            total: ordersTable.total,
            status: ordersTable.stripePaymentIntentStatus,
            addressId: ordersTable.addressId,
            storeId: ordersTable.storeId,
            email: ordersTable.email,
            city: addressesTable.city,
            state: addressesTable.state,
            country: addressesTable.country,
            createdAt: ordersTable.createdAt,
        })
        .from(ordersTable)
        .where((order) =>
            and(
                eq(order.storeId, storeId),
                between(order.total, minTotal.toString(), maxTotal.toString()),
                text ? like(order.title, `%${text}%`) : undefined,
                email ? like(order.email, `%${email}%`) : undefined
            )
        )
        .innerJoin(addressesTable, eq(ordersTable.addressId, addressesTable.id))
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

    return orders
}
