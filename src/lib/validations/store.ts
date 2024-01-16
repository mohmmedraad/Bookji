import { maxLength, minLength, object, string,type Input } from "valibot"

export const storeInfoSchema = object({
    name: string([
        minLength(10, "the name must be at least 10 character long"),
        maxLength(50, "the name must be below the 50 character"),
    ]),
    description: string([minLength(25, "the description must be at least 25 character long")]),
})

export type StoreInfoSchema = Input<typeof storeInfoSchema>