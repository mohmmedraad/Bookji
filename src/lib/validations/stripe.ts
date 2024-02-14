import {
    boolean,
    nullType,
    number,
    object,
    string,
    undefinedType,
    union,
} from "valibot"

export const manageSubscriptionSchema = object({
    stripePriceId: string(),
    stripeCustomerId: union([string(), nullType(), undefinedType()]),
    stripeSubscriptionId: union([string(), nullType(), undefinedType()]),
    isSubscribed: boolean(),
    isCurrentPlan: boolean(),
})

export const createPaymentIntentSchema = object({
    amount: number(),
    storeId: number(),
})
