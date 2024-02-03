import { wrap } from "@decs/typeschema"
import { TRPCError } from "@trpc/server"
import { number, object, string } from "valibot"

import { stripe } from "@/lib/stripe"
import { absoluteUrl } from "@/lib/utils"

import { privateProcedure, router } from "../trpc"
import { createStripeAccount, getStripeAccount } from "../utils"

export const stripeRouter = router({
    createAccountLink: privateProcedure
        .input(
            wrap(
                object({
                    storeId: number(),
                    storeSlug: string(),
                })
            )
        )
        .mutation(async ({ input: { storeId, storeSlug } }) => {
            try {
                const { isConnected, payment, account } =
                    await getStripeAccount(storeId)

                if (isConnected) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "Account already connected",
                    })
                }

                // Delete the existing account if details have not been submitted
                if (account && !account.details_submitted) {
                    await stripe.accounts.del(account.id)
                }

                const stripeAccountId =
                    payment?.stripeAccountId ??
                    (await createStripeAccount(payment, storeId))

                if (!stripeAccountId) {
                    console.log("error:", "Failed to create account")
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Failed to create account",
                    })
                }

                const accountLink = await stripe.accountLinks.create({
                    account: stripeAccountId,
                    refresh_url: `https://bookji.vercel.app/dashboard/${storeSlug}`,
                    return_url: `https://bookji.vercel.app/dashboard/${storeSlug}`,
                    type: "account_onboarding",
                })

                console.log("accountLink: ", accountLink)
                if (!accountLink?.url) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Failed to create account link",
                    })
                }

                return accountLink.url
            } catch (error) {
                console.log("error:", error)
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to create account link",
                })
            }
        }),
})
