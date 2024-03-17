import {
    coerce,
    custom,
    fallback,
    merge,
    minValue,
    nullable,
    number,
    object,
    optional,
    record,
    string,
    transform,
    type Input,
} from "valibot"

export const searchParamsSchema = object({
    searchParams: record(string(), nullable(string(), "")),
})

export const generalSearchParamsSchema = object({
    page: fallback(coerce(number([minValue(1)]), Number), 1),
    from: optional(string()),
    to: optional(string()),
    sortBy: transform(
        fallback(
            string([custom((value) => value.split(".").length === 2)]),
            "createdAt.desc"
        ),
        (input) => input.split(".")
    ),
    text: optional(fallback(string(), "")),
})

export const booksSearchParamsSchema = object({
    page: fallback(coerce(number([minValue(1)]), Number), 1),
    from: optional(string()),
    to: optional(string()),
    sortBy: transform(
        fallback(
            string([custom((value) => value.split(".").length === 2)]),
            "createdAt.desc"
        ),
        (input) => input.split(".")
    ),
    text: fallback(string(), ""),
    author: fallback(string(), ""),
    categories: transform(fallback(string(), ""), (input) =>
        input ? input.split(".") : []
    ),
    price: createRangeSchema("0-500"),
    inventory: createRangeSchema("0-100"),
    orders: createRangeSchema("0-300"),
    rating: createRangeSchema("0-5"),
})

export const ordersSearchParamsSchema = merge([
    generalSearchParamsSchema,
    object({
        email: optional(fallback(string(), "")),
        city: optional(fallback(string(), "")),
        state: optional(fallback(string(), "")),
        country: optional(fallback(string(), "")),
        total: createRangeSchema("0-500"),
        customers: createOptionsSchema(),
    }),
])

export const purchasesSearchParamsSchema = merge([
    generalSearchParamsSchema,
    object({
        total: createRangeSchema("0-500"),
        stores: createOptionsSchema(),
    }),
])

export const customersSearchParamsSchema = merge([
    generalSearchParamsSchema,
    object({
        place: optional(fallback(string(), "")),
        total_spend: createRangeSchema("0-500"),
        total_orders: createRangeSchema("0-500"),
        customers: createOptionsSchema(),
    }),
])

export type OrdersSearchParamsSchema = Input<typeof ordersSearchParamsSchema>

function customRangeValidation(value: string) {
    const isValueValid =
        value.split("-").length === 2 &&
        value.split("-").every((v) => !isNaN(Number(v)))
    return isValueValid
}

function createRangeSchema(defaultValue: string) {
    const schema = optional(
        transform(
            fallback(string([custom(customRangeValidation)]), defaultValue),
            (input) => input.split("-").map(Number)
        ),
        defaultValue
    )

    return schema
}

function createOptionsSchema() {
    return transform(fallback(string(), ""), (input) =>
        input ? [...new Set(input.split("."))] : []
    )
}
