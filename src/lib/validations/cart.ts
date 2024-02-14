import { merge, minValue, number, object, string } from "valibot"

export const cartItemSchema = object({
    bookId: number(),
    quantity: number([minValue(0)]),
})

export const checkoutItemSchema = merge([
    cartItemSchema,
    object({
        price: number(),
    }),
])
