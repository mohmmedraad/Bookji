import { nullType, object, string, undefinedType, union } from "valibot"

export const userPrivateMetadataSchema = object({
    // role: enum(["user", "admin", "super_admin"]),
    stripePriceId: union([string(), nullType(), undefinedType()]),
    stripeSubscriptionId: union([string(), nullType(), undefinedType()]),
    stripeCustomerId: union([string(), nullType(), undefinedType()]),
    stripeCurrentPeriodEnd: union([string(), nullType(), undefinedType()]),
})
