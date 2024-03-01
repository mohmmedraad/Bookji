import { number, object, string, type Input } from "valibot"

export const orderSchema = object({
    id: number(),
    title: string(),
    // author: string(),
    // cover: string(),
    // categories: string(),
    // rating: number(),
    // price: number(),
    // customerName: string(),
    // customerAvatar: string(),
    status: string(),
    customer: string(),
    total: number(),
})

export type OrderType = Input<typeof orderSchema>
