import { type Book } from "@/db/schema"
import { type TRPCError } from "@trpc/server"
import { type Input } from "valibot"

import { type Price } from "@/lib/validations/book"
import {
    type cartItemSchema,
    type checkoutItemSchema,
} from "@/lib/validations/cart"
import { type OurFileRouter } from "@/app/api/uploadthing/core"

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
    categories: string[] | null
    minPrice: number
    maxPrice: number
    minRating: number
    maxRating: number
}

export type PartialBook = Pick<
    Book,
    "id" | "userId" | "cover" | "title" | "slug"
>

export type StarType = number

export interface TRPCErrorType {
    code: TRPCError["code"] | undefined
    message: TRPCError["message"]
}

export type Customer = {
    id: number
    email: string
    place: string
    totalSpend: number
}

export type Endpoint = keyof OurFileRouter

export interface SubscriptionPlan {
    id: "basic" | "standard" | "pro"
    name: string
    description: string
    features: string[]
    stripePriceId: string
    price: number
}

export interface UserSubscriptionPlan extends SubscriptionPlan {
    stripeSubscriptionId?: string | null
    stripeCurrentPeriodEnd?: string | null
    stripeCustomerId?: string | null
    isSubscribed: boolean
    isCanceled: boolean
    isActive: boolean
}

export interface SearchParams {
    [key: string]: string | string[] | undefined
}
