import { type Input } from "valibot"

import {
    type cartItemSchema,
    type checkoutItemSchema,
} from "@/lib/validations/cart"

export type CartItem = Input<typeof cartItemSchema>

export type CheckoutItem = Input<typeof checkoutItemSchema>
