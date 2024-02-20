import {
    array,
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
})

export const booksSearchParamsSchema = merge([
    searchParamsSchema,
    object({
        text: fallback(string(), ""),
        categories: fallback(array(number()), []),
        cost: object({
            min: fallback(number(), 0),
            max: fallback(number(), 500),
        }),
    }),
])
