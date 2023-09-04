import { Input } from "valibot"

import { cartItemSchema, checkoutItemSchema } from "@/lib/validations/cart"

export type CartItem = Input<typeof cartItemSchema>

export type CheckoutItem = Input<typeof checkoutItemSchema>
