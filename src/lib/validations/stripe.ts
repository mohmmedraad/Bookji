import { boolean, number, object, optional, string } from "valibot"

export const manageSubscriptionSchema = object({
    stripePriceId: string(),
    stripeCustomerId: optional(string()),
    stripeSubscriptionId: optional(string()),
    isSubscribed: boolean(),
    isCurrentPlan: boolean(),
})

export const createPaymentIntentSchema = object({
    amount: number(),
    storeId: number(),
})
