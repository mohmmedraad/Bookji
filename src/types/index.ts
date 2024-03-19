import { type Book } from "@/db/schema"
import {
    type getPurchases,
    type getShopPageBooks,
    type getStoreBooks,
    type getStoreCustomers,
    type getStoreOrders,
} from "@/server/fetchers"
import type { User } from "@clerk/nextjs/server"
import { type OAuthStrategy } from "@clerk/types"
import { type TRPCError } from "@trpc/server"
import { type Input } from "valibot"

import {
    type cookiesSettingsSchema,
    type emailSettingSchema,
    type generalInformationSchema,
    type updateUserSchema,
} from "@/lib/validations/auth"
import {
    type cartItemSchema,
    type checkoutItemSchema,
} from "@/lib/validations/cart"
import { type Icons } from "@/components/Icons"
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

export type SearchParams = Record<string, string>

export type Customer = Pick<
    User,
    "firstName" | "lastName" | "username" | "imageUrl"
>

export type OrderColumn = Awaited<ReturnType<typeof getStoreOrders>>[number]

export type PurchasesColumn = Awaited<ReturnType<typeof getPurchases>>[number]

export type CustomerColumn = Awaited<
    ReturnType<typeof getStoreCustomers>
>[number]

export type BookColumn = Awaited<ReturnType<typeof getStoreBooks>>[number]

export type GeneralInformationSchema = Input<typeof generalInformationSchema>

export type CookiesSettingsSchema = Input<typeof cookiesSettingsSchema>

export type EmailSettingSchema = Input<typeof emailSettingSchema>

export type OauthProvider = {
    name: string
    icon: keyof typeof Icons
    strategy: OAuthStrategy
}

export type UserLinkedAccounts = (OauthProvider &
    ({ isConnected: true; path: string } | { isConnected: false }))[]

export type UpdateUserSchema = Required<Input<typeof updateUserSchema>>

export type GetBooksSchema = {
    page: number
    sortBy: string[]
    text: string
    author: string
    categories: string[]
    price: number[]
    inventory: number[]
    orders: number[]
    rating: number[]
    stores: string[]
    limit: number
    cursor: number
    from?: string | undefined
    to?: string | undefined
}

export type ShopPageBook = Awaited<ReturnType<typeof getShopPageBooks>>[number]
