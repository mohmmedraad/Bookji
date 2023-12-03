import { merge, minValue, number, object, string } from "valibot"

export const cartItemSchema = object({
    bookId: string(),
    quantity: number([minValue(0)]),
})

export const checkoutItemSchema = merge([
    cartItemSchema,
    object({
        price: number(),
    }),
])
