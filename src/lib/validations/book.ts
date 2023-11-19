import {
    array,
    blob,
    coerce,
    maxLength,
    maxSize,
    merge,
    mimeType,
    minLength,
    minValue,
    number,
    object,
    string,
    type Input,
} from "valibot"

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

export const addBookFormSchema = object({
    title: string([minLength(5, "The title must be above the 5 characters")]),
    description: string([
        minLength(10, "The description length must be above 10 characters"),
        maxLength(250, "The description length must be below 250 characters"),
    ]),
    tags: array(string(), "The tags must be an array of strings"),
    price:
        // coerce(
        string([minValue("0", "The price must be positive.")]),
    // ,Number)
    inventory: coerce(
        number([minValue(1, "The number of items must be above the 1")]),
        Number
    ),
})

export const bookCoverSchema = blob([
    mimeType(
        ["image/webp", "image/png", "image/jpg", "image/jpeg"],
        "Only images of type webp, png and jpg are allowed"
    ),
    maxSize(1_048_576, "File size must be less than 1MB"),
])

export const extendedBookSchema = merge([
    addBookFormSchema,
    object({
        cover: string("The cover key is required"),
    }),
])

export const updateBookSchema = merge([
    addBookFormSchema,
    object({ id: number(), cover: string("The cover key is required") }),
])

export type BookCoverSchema = Input<typeof bookCoverSchema>
export type AddBookFormSchema = Input<typeof addBookFormSchema>
