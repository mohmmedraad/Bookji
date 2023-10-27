import { type Input } from "valibot"

import {
    type cartItemSchema,
    type checkoutItemSchema,
} from "@/lib/validations/cart"

export type CartItem = Input<typeof cartItemSchema>

export type CheckoutItem = Input<typeof checkoutItemSchema>

export type ClerkErrorCode =
    | "form_identifier_exists"
    | "session_exists"
    | "form_identifier_not_found"

export type ClerkAPIError = {
    errors: {
        code: string
        message: string
    }[]
}
