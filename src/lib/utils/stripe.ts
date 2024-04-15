import { db } from "@/db"
import { payments, stores as storesTable } from "@/db/schema"
import { eq } from "drizzle-orm"

import { stripe } from "../stripe"

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
            where: eq(storesTable.id, storeId),
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
            const transaction = Promise.all([
                await db
                    .update(payments)
                    .set({
                        detailsSubmitted: account.details_submitted,
                        stripeAccountCreatedAt: account.created,
                    })
                    .where(eq(payments.storeId, storeId)),
                await db
                    .update(storesTable)
                    .set({
                        stripeAccountId: account.id,
                        active: true,
                    })
                    .where(eq(storesTable.id, storeId)),
            ])

            await transaction
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
