import { headers } from "next/headers"
import { db } from "@/db"
import {
    addresses,
    books,
    cartItems,
    orderItems,
    orders,
    payments,
} from "@/db/schema"
import type { CheckoutItem } from "@/types"
import { clerkClient } from "@clerk/nextjs/server"
import { and, eq } from "drizzle-orm"
import type Stripe from "stripe"
import { array, safeParse } from "valibot"

import { stripe } from "@/lib/stripe"
import { checkoutItemSchema } from "@/lib/validations/cart"

export async function POST(req: Request) {
    const body = await req.text()
    const signature = headers().get("Stripe-Signature") ?? ""
    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET as string
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

        // Handling payment events
        case "payment_intent.payment_failed":
            const paymentIntentPaymentFailed = event.data.object
            console.log(
                `❌ Payment failed: ${paymentIntentPaymentFailed.last_payment_error?.message}`
            )
            break
        case "payment_intent.processing":
            const paymentIntentProcessing = event.data.object
            console.log(`⏳ Payment processing: ${paymentIntentProcessing.id}`)
            break
        case "payment_intent.succeeded":
            const paymentIntentSucceeded = event.data.object

            const paymentIntentId = paymentIntentSucceeded?.id
            const orderAmount = paymentIntentSucceeded?.amount
            const checkoutItems = paymentIntentSucceeded?.metadata
                ?.items as unknown as CheckoutItem[]
            const cartId = paymentIntentSucceeded?.metadata?.cartId as
                | string
                | undefined
            const storeId = paymentIntentSucceeded?.metadata?.storeId as
                | string
                | undefined

            console.log("checkout metadata: ", paymentIntentSucceeded?.metadata)

            // If there are items in metadata, then create order
            if (checkoutItems) {
                try {
                    if (!event.account) throw new Error("No account found.")
                    if (!storeId || isNaN(Number(storeId)))
                        throw new Error(
                            "store id not provided in the payment_intent metadata"
                        )

                    if (!cartId || isNaN(Number(cartId)))
                        throw new Error(
                            "cart id not provided in the payment_intent metadata"
                        )

                    const userCart = await db.query.carts.findFirst({
                        columns: {
                            id: true,
                            userId: true,
                        },
                        where: (cart) => eq(cart.id, Number(cartId)),
                    })

                    if (!userCart) throw new Error("cart not found.")

                    // Parsing items from metadata
                    // Didn't parse before because can pass the unparsed data directly to the order table items json column in the db
                    const items = JSON.parse(
                        paymentIntentSucceeded?.metadata?.items ?? "[]"
                    ) as typeof checkoutItemSchema | []

                    const safeParsedItems = safeParse(
                        array(checkoutItemSchema),
                        items
                    )

                    if (!safeParsedItems.success) {
                        throw new Error("Could not parse items.")
                    }

                    const payment = await db.query.payments.findFirst({
                        columns: {
                            storeId: true,
                        },
                        where: eq(payments.stripeAccountId, event.account),
                    })

                    if (!payment?.storeId) {
                        return new Response("Book not found.", { status: 404 })
                    }

                    // Create new address in DB
                    const stripeAddress =
                        paymentIntentSucceeded?.shipping?.address

                    const newAddress = (
                        await db
                            .insert(addresses)
                            .values({
                                line1: stripeAddress?.line1,
                                line2: stripeAddress?.line2,
                                city: stripeAddress?.city,
                                state: stripeAddress?.state,
                                country: stripeAddress?.country,
                                postalCode: stripeAddress?.postal_code,
                            })
                            .returning({ insertId: addresses.id })
                    )[0]

                    if (!newAddress.insertId)
                        throw new Error("No address created.")
                    // Create new order in db
                    const { insertId: insertedOrderId } = (
                        await db
                            .insert(orders)
                            .values({
                                // @ts-expect-error - storeId is not in the insert type
                                storeId: payment.storeId,
                                userId: userCart.userId,
                                quantity: safeParsedItems.output.reduce(
                                    (acc, item) => acc + item.quantity,
                                    0
                                ),
                                total: Number(orderAmount) / 100,
                                stripePaymentIntentId: paymentIntentId,
                                stripePaymentIntentStatus:
                                    paymentIntentSucceeded?.status,
                                name: paymentIntentSucceeded?.shipping?.name,
                                email: paymentIntentSucceeded?.receipt_email,
                                addressId: Number(newAddress.insertId),
                            })
                            .returning({ insertId: orders.id })
                    )[0]

                    const newOrderItems = safeParsedItems.output.map(
                        ({ bookId, quantity }) => ({
                            bookId,
                            quantity,
                            orderId: +insertedOrderId,
                        })
                    )
                    // insert order items in db
                    await db.insert(orderItems).values(newOrderItems)

                    // Update books inventory in db
                    for (const item of safeParsedItems.output) {
                        const book = await db.query.books.findFirst({
                            columns: {
                                id: true,
                                inventory: true,
                            },
                            where: eq(books.id, item.bookId),
                        })

                        if (!book) {
                            throw new Error("book not found.")
                        }

                        const inventory = book.inventory - item.quantity

                        if (inventory < 0) {
                            throw new Error("book out of stock.")
                        }

                        await db
                            .update(books)
                            .set({
                                inventory: book.inventory - item.quantity,
                            })
                            .where(eq(books.id, item.bookId))
                    }

                    // Remove items from cart
                    await db
                        .delete(cartItems)
                        .where(
                            and(
                                eq(cartItems.cartId, userCart.id),
                                eq(cartItems.storeId, Number(storeId))
                            )
                        )
                } catch (err) {
                    console.log("Error creating order.", err)
                }
            }
            break
        case "application_fee.created":
            const applicationFeeCreated = event.data.object
            console.log(`Application fee id: ${applicationFeeCreated.id}`)
            break
        case "charge.succeeded":
            const chargeSucceeded = event.data.object
            console.log(`Charge id: ${chargeSucceeded.id}`)
            break
        default:
            console.warn(`Unhandled event type: ${event.type}`)
    }

    return new Response(null, { status: 200 })
}
