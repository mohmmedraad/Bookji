import { env } from "@/env.mjs"
import Stripe from "stripe"

export const stripe = new Stripe(env.STRIPE_API_KEY as string, {
    apiVersion: "2023-10-16",
    typescript: true,
})
