import {
    array,
    blob,
    coerce,
    fallback,
    maxLength,
    maxSize,
    maxValue,
    merge,
    mimeType,
    minLength,
    minValue,
    nullType,
    number,
    object,
    optional,
    string,
    toTrimmed,
    transform,
    union,
    url,
    type Input,
} from "valibot"

import { booksSearchParamsSchema } from "./params"

export const bookSchema = object({
    id: number(),
    title: string(),
    author: string(),
    cover: string(),
    inventory: number(),
    categories: string(),
    rating: number(),
    price: number(),
})

export type BookType = Input<typeof bookSchema>

export const bookFormSchema = object({
    title: string([
        minLength(5, "The title must be above the 5 characters"),
        toTrimmed(),
    ]),
    author: string([
        minLength(5, "The author name must be above the 5 characters"),
        maxLength(191, "The author name must be blew the 191 characters"),
        toTrimmed(),
    ]),
    description: string([
        minLength(10, "The description length must be above 10 characters"),
        maxLength(250, "The description length must be below 250 characters"),
    ]),
    categories: array(
        object({
            id: number(),
            name: string(),
        }),
        [minLength(1, "You must select at least one category")]
    ),
    price: string([minValue("0", "The price must be positive.")]),
    inventory: coerce(
        number([minValue(1, "The number of items must be above the 1")]),
        Number
    ),
    cover: string([url()]),
})

export const bookCoverSchema = blob([
    mimeType(
        ["image/webp", "image/png", "image/jpg", "image/jpeg"],
        "Only images of type webp, png and jpg are allowed"
    ),
    maxSize(1_048_576, "File size must be less than 1MB"),
])

export const extendedBookSchema = merge([
    bookFormSchema,
    object({
        cover: string("The cover key is required"),
        storeId: number("The storeId key is required"),
    }),
])

export const updateBookSchema = merge([
    bookFormSchema,
    object({ bookId: number(), cover: string("The cover key is required") }),
])

const cost = object({
    min: number(),
    max: number(),
})

export const searchParams = object({
    userId: string(),
    text: string(),
    categories: array(number()),
    cost,
})

export type SearchParams = Input<typeof searchParams>

export const getBooksSchema = merge([
    booksSearchParamsSchema,
    object({
        stores: transform(fallback(string(), ""), (input) =>
            input ? input.split(".") : []
        ),
        limit: optional(
            fallback(coerce(number([minValue(1)]), Number), 10),
            10
        ),
        cursor: optional(fallback(number(), 0), 0),
    }),
])

export type Price = Input<typeof cost>

export const rateBookSchema = object({
    bookId: number(),
    rating: number([
        minValue(1, "The rating must be above 0"),
        maxValue(5, "The rating must be below 6"),
    ]),
    comment: string([
        maxLength(500, "The comment length must be below 500 characters"),
        minLength(10, "The comment length must be above 10 characters"),
    ]),
})

export const userRatingSchema = object({
    bookId: number(),
})

export const getRatingsSchema = object({
    limit: coerce(number([minValue(1)]), Number),
    cursor: union([nullType(), number()]),
    bookId: number(),
})

export const getUserBooksSchema = object({
    limit: coerce(number([minValue(1)]), Number),
    cursor: union([nullType(), number()]),
    storeId: number(),
    excludedBooks: array(number()),
})

export const deleteBookSchema = object({
    booksIds: array(number()),
})

export type RateBookSchema = Input<typeof rateBookSchema>
export type BookCoverSchema = Input<typeof bookCoverSchema>
export type BookFormSchema = Input<typeof bookFormSchema>
