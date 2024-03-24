import { db } from "@/db"
import { wrap } from "@decs/typeschema"
import { TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"
import { number, object, string } from "valibot"

import { stripe } from "@/lib/stripe"
import { absoluteUrl } from "@/lib/utils"
import { absoluteUrl, getUserEmail } from "@/lib/auth"
import { createCart } from "@/lib/utils/cart"
import { getStripeAccount ,createStripeAccount} from "@/lib/utils/stripe"
import {
    createPaymentIntentSchema,
    manageSubscriptionSchema,
} from "@/lib/validations/stripe"

import { privateProcedure, router } from "../trpc"

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

                // const url =
                //     process.env.NEXT_PUBLIC_VERCEL_URL ??
                //     "http://localhost:3000"

                const accountLink = await stripe.accountLinks.create({
                    account: stripeAccountId,
                    refresh_url: absoluteUrl(`/dashboard/${storeSlug}`),
                    return_url: absoluteUrl(`/dashboard/${storeSlug}`),
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
                console.log("stripe create account link error: ", error)
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "some error occurred while creating account link",
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

    createPaymentIntent: privateProcedure
        .input(wrap(createPaymentIntentSchema))
        .mutation(async ({ input }) => {
            try {
                const store = await db.query.stores.findFirst({
                    columns: { stripeAccountId: true },
                    where: (store) => eq(store.id, input.storeId),
                })

                if (!store) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Store not found",
                    })
                }

                if (!store.stripeAccountId) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Store stripe connection not found",
                    })
                }

                const { isConnected, payment } = await getStripeAccount(
                    input.storeId
                )

                if (!isConnected || !payment) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Store is not connected to Stripe",
                    })
                }

                const paymentIntent = await stripe.paymentIntents.create(
                    {
                        amount: input.amount,
                        currency: "usd",
                        payment_method_types: ["card"],

                        automatic_payment_methods: {
                            enabled: true,
                        },
                    },
                    {
                        stripeAccount: payment.stripeAccountId,
                    }
                )

                if (!paymentIntent.client_secret) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Failed to create payment intent",
                    })
                }

                return { clientSecret: paymentIntent.client_secret }
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to create payment intent",
                })
            }
        }),

    createCheckoutSession: privateProcedure
        .input(wrap(createPaymentIntentSchema))
        .mutation(async ({ input, ctx }) => {
            const store = await db.query.stores.findFirst({
                columns: { stripeAccountId: true },
                where: (store) => eq(store.id, input.storeId),
            })

            if (!store) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Store not found",
                })
            }

            if (!store.stripeAccountId) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Store stripe connection not found",
                })
            }

            const { isConnected, payment } = await getStripeAccount(
                input.storeId
            )

            if (!isConnected || !payment) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Store is not connected to Stripe",
                })
            }

            const cart = await db.query.carts.findFirst({
                columns: { id: true },
                with: {
                    items: {
                        where: (item) => eq(item.storeId, input.storeId),
                        columns: { bookId: true, quantity: true },
                        with: {
                            book: {
                                columns: {
                                    cover: true,
                                    title: true,
                                    price: true,
                                    storeId: true,
                                },
                            },
                        },
                    },
                },
                where: (cart) => eq(cart.userId, ctx.userId),
            })

            if (!cart) {
                await createCart(ctx.userId)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Cart not found, please try again",
                })
            }

            if (cart.items === null || cart.items.length === 0) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Cart not found, please try again",
                })
            }

            const cartItems = cart.items.map(({ book, bookId, quantity }) => ({
                bookId,
                quantity,
                ...book,
            }))

            try {
                const session = await stripe.checkout.sessions.create(
                    {
                        line_items: cartItems.map((item) => ({
                            price_data: {
                                currency: "usd",
                                product_data: {
                                    name: item.title,
                                    images: [item.cover!],
                                },
                                unit_amount: +item.price * 100,
                            },
                            quantity: cart.items!.find(
                                (i) => i.bookId === item.bookId
                            )?.quantity,
                        })),
                        payment_intent_data: {
                            metadata: {
                                items: JSON.stringify(
                                    cartItems.map((item) => ({
                                        bookId: item.bookId,
                                        storeId: item.storeId,
                                        quantity: cart.items!.find(
                                            (i) => i.bookId === item.bookId
                                        )?.quantity,
                                        price: +item.price,
                                    }))
                                ),
                                storeId: input.storeId.toString(),
                                cartId: cart.id.toString(),
                                connectAccountPayments: "true",
                            },
                            application_fee_amount: 3 * 100,
                        },
                        shipping_address_collection: {
                            allowed_countries: ["US"],
                        },
                        billing_address_collection: "required",
                        mode: "payment",
                        success_url: absoluteUrl(`/checkout?success=true`),
                        cancel_url: absoluteUrl(`/cart?canceled=true`),
                        client_reference_id: cart.id.toString(),
                    },
                    {
                        stripeAccount: payment.stripeAccountId,
                    }
                )

                if (!session.url) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Failed to create checkout session",
                    })
                }

                console.log("payment_intent: ", session.payment_intent)

                return {
                    url: session.url,
                }
            } catch (error) {
                console.log("stripe error: ", error)
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to create checkout session",
                })
            }
        }),
})
