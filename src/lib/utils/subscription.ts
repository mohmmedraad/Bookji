import { db } from "@/db"
import {
    books as booksTable,
    stores as storesTable,
} from "@/db/schema"
import type {
    SubscriptionPlan,
    UserSubscriptionPlan,
} from "@/types"
import { clerkClient } from "@clerk/nextjs/server"
import { addDays } from "date-fns"
import {
    and,
    countDistinct,
    eq,
} from "drizzle-orm"
import { parse } from "valibot"

import { subscriptionPlans } from "@/config/site"
import { stripe } from "@/lib/stripe"
import { userPrivateMetadataSchema } from "@/lib/validations/auth"


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
            ? Object.values(subscriptionPlans).find(
                  (plan) =>
                      plan.stripePriceId === userPrivateMetadata.stripePriceId
              )
            : subscriptionPlans.Basic

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

export function getPlanLimits({ planId }: { planId?: SubscriptionPlan["id"] }) {
    const { features } = subscriptionPlans[planId ?? "Basic"]

    const [storesLimit, booksLimit] = features.map((feature) => {
        const [value] = feature.match(/\d+/) || []
        return value ? parseInt(value, 10) : 0
    })

    return {
        storesLimit: storesLimit ?? 0,
        booksLimit: booksLimit ?? 0,
    }
}

export async function getStoresCount(userId: string) {
    try {
        const data = await db
            .select({
                storeCount: countDistinct(storesTable.id),
            })
            .from(storesTable)
            .where(eq(storesTable.ownerId, userId))
            .groupBy(storesTable.ownerId)
            .execute()
            .then((res) => res[0])

        return {
            storeCount: data?.storeCount ?? 0,
        }
    } catch (err) {
        return {
            storeCount: 0,
        }
    }
}

export async function getStoreBooksCount(userId: string, storeId: number) {
    try {
        const data = await db
            .select({
                booksCount: countDistinct(booksTable.id),
            })
            .from(booksTable)
            .where(and(eq(booksTable.storeId, storeId)))
            .groupBy(booksTable.storeId)
            .execute()
            .then((res) => res[0])

        return {
            booksCount: data?.booksCount ?? 0,
        }
    } catch (err) {
        return {
            booksCount: 0,
        }
    }
}
