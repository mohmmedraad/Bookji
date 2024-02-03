import { db } from "@/db"
import { books, booksToCategories, payments, stores } from "@/db/schema"
import { and, eq } from "drizzle-orm"

import { stripe } from "@/lib/stripe"

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

export async function getStripeAccountLink(storeId: number) {
    const falsyReturn = {
        isConnected: false,
        account: null,
        payment: null,
    }

    try {
        const retrieveAccount = true

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
