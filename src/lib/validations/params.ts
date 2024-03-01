import {
    coerce,
    custom,
    fallback,
    merge,
    minValue,
    number,
    object,
    optional,
    string,
    transform,
} from "valibot"

export const searchParamsSchema = object({
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
    categories: transform(fallback(string(), ""), (input) =>
        input ? input.split(".") : []
    ),
    price: validateRangeSchema("0-500"),
    inventory: validateRangeSchema("0-100"),
    rating: validateRangeSchema("0-5"),
})

export const ordersSearchParamsSchema = merge([
    searchParamsSchema,
    object({
        email: optional(fallback(string(), "")),
        city: optional(fallback(string(), "")),
        state: optional(fallback(string(), "")),
        country: optional(fallback(string(), "")),
        total: validateRangeSchema("0-500"),
    }),
])

function customRangeValidation(value: string) {
    const isValueValid =
        value.split("-").length === 2 &&
        value.split("-").every((v) => !isNaN(Number(v)))
    return isValueValid
}

function validateRangeSchema(defaultValue: string) {
    const schema = transform(
        fallback(string([custom(customRangeValidation)]), defaultValue),
        (input) => input.split("-").map(Number)
    )

    return schema
}
