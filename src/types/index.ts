import { type Input } from "valibot"

import { type Cost } from "@/lib/validations/book"
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

export interface Category {
    id: number
    name: string
    icon?: React.ComponentType<{ className?: string }>
}

export interface FiltersType {
    categories: Category[] | null
    cost: Cost
}
