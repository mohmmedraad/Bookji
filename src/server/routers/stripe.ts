import { wrap } from "@decs/typeschema"
import { TRPCError } from "@trpc/server"
import { number, object, string } from "valibot"

import { stripe } from "@/lib/stripe"
import { absoluteUrl, getUserEmail } from "@/lib/utils"
import { manageSubscriptionSchema } from "@/lib/validations/stripe"

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
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Failed to create account",
                    })
                }

                const url =
                    process.env.NEXT_PUBLIC_VERCEL_URL ??
                    "http://localhost:3000"
                const accountLink = await stripe.accountLinks.create({
                    account: stripeAccountId,
                    refresh_url: `${url}/dashboard/${storeSlug}`,
                    return_url: `${url}/dashboard/${storeSlug}`,
                    type: "account_onboarding",
                })

                if (!accountLink?.url) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Failed to create account link",
                    })
                }

                return accountLink.url
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to create account link",
                })
            }
        }),

    manageSubscription: privateProcedure
        .input(wrap(manageSubscriptionSchema))
        .mutation(async ({ input, ctx: { user } }) => {
            const email = getUserEmail(user)

            const billingUrl =
                process.env.NEXT_PUBLIC_VERCEL_URL ??
                "http://localhost:3000/dashboard/billing"

            // If the user is already subscribed to a plan, we redirect them to the Stripe billing portal
            if (
                input.isSubscribed &&
                input.stripeCustomerId &&
                input.isCurrentPlan
            ) {
                const stripeSession =
                    await stripe.billingPortal.sessions.create({
                        customer: input.stripeCustomerId,
                        return_url: billingUrl,
                    })

                return {
                    url: stripeSession.url,
                }
            }
            // If the user is not subscribed to a plan, we create a Stripe Checkout session
            const stripeSession = await stripe.checkout.sessions.create({
                success_url: billingUrl,
                cancel_url: billingUrl,
                payment_method_types: ["card"],
                mode: "subscription",
                billing_address_collection: "auto",
                customer_email: email,
                line_items: [
                    {
                        price: input.stripePriceId,
                        quantity: 1,
                    },
                ],
                metadata: {
                    userId: user.id,
                },
            })

            return {
                url: stripeSession.url,
            }
        }),
})
