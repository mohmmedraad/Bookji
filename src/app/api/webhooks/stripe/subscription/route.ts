import { headers } from "next/headers"
import { clerkClient } from "@clerk/nextjs/server"
import type Stripe from "stripe"

import { stripe } from "@/lib/stripe"

export async function POST(req: Request) {
    const body = await req.text()
    const signature = headers().get("Stripe-Signature") ?? ""
    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_SUBSCRIPTION_WEBHOOK_SECRET as string
        )
    } catch (err) {
        console.log("webhooks error: ", err)
        return new Response(
            `Webhook Error: ${
                err instanceof Error ? err.message : "Unknown error."
            }`,
            { status: 400 }
        )
    }

    console.log("event: ", event.type)

    switch (event.type) {
        // Handling subscription events
        case "checkout.session.completed":
            const checkoutSessionCompleted = event.data.object

            // If there is a user id, and no cart id in the metadata, then this is a new subscription
            if (
                checkoutSessionCompleted?.metadata?.userId &&
                !checkoutSessionCompleted?.metadata?.cartId
            ) {
                // Retrieve the subscription details from Stripe
                const subscription = await stripe.subscriptions.retrieve(
                    checkoutSessionCompleted.subscription as string
                )

                // Update the user stripe into in our database.
                // Since this is the initial subscription, we need to update
                // the subscription id and customer id.
                await clerkClient.users.updateUserMetadata(
                    checkoutSessionCompleted?.metadata?.userId,
                    {
                        privateMetadata: {
                            stripeSubscriptionId: subscription.id,
                            stripeCustomerId: subscription.customer as string,
                            stripePriceId: subscription.items.data[0]?.price.id,
                            stripeCurrentPeriodEnd: new Date(
                                subscription.current_period_end * 1000
                            ),
                        },
                    }
                )
            }
            break
        case "invoice.payment_succeeded":
            const invoicePaymentSucceeded = event.data.object

            // If there is a user id, and no cart id in the metadata, then this is a new subscription
            if (
                invoicePaymentSucceeded?.metadata?.userId &&
                !invoicePaymentSucceeded?.metadata?.cartId
            ) {
                // Retrieve the subscription details from Stripe
                const subscription = await stripe.subscriptions.retrieve(
                    invoicePaymentSucceeded.subscription as string
                )

                // Update the price id and set the new period end
                await clerkClient.users.updateUserMetadata(
                    invoicePaymentSucceeded?.metadata?.userId,
                    {
                        privateMetadata: {
                            stripePriceId: subscription.items.data[0]?.price.id,
                            stripeCurrentPeriodEnd: new Date(
                                subscription.current_period_end * 1000
                            ),
                        },
                    }
                )
            }
            break
        default:
            console.warn(`Unhandled event type: ${event.type}`)
    }

    return new Response(null, { status: 200 })
}
