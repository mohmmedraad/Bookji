import { db } from "@/db"
import { books, booksToCategories, payments, stores } from "@/db/schema"
import { UserSubscriptionPlan } from "@/types"
import { clerkClient } from "@clerk/nextjs"
import { addDays } from "date-fns"
import { and, eq } from "drizzle-orm"
import { parse } from "valibot"

import { storeSubscriptionPlans } from "@/config/site"
import { stripe } from "@/lib/stripe"
import { userPrivateMetadataSchema } from "@/lib/validations/auth"

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
