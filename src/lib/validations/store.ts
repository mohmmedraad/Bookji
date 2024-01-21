import {
    blob,
    maxLength,
    maxSize,
    merge,
    mimeType,
    minLength,
    object,
    string,
    url,
    type Input,
} from "valibot"

export const storeInfoSchema = object({
    name: string([
        minLength(10, "the name must be at least 10 character long"),
        maxLength(50, "the name must be below the 50 character"),
    ]),
    description: string([
        minLength(25, "the description must be at least 25 character long"),
    ]),
})

export const newStoreSchema = merge([
    storeInfoSchema,
    object({
        logo: string([url()]),
        thumbnail: string([url()]),
    }),
])

export const storeLogoSchema = blob([
    mimeType(
        ["image/webp", "image/png", "image/jpg", "image/jpeg"],
        "Only images of type webp, png and jpg are allowed"
    ),
    maxSize(524_288, "File size must be less than 512KB"),
])

export const storeThumbnailSchema = blob([
    mimeType(
        ["image/webp", "image/png", "image/jpg", "image/jpeg"],
        "Only images of type webp, png and jpg are allowed"
    ),
    maxSize(1_048_576, "File size must be less than 1MB"),
])

export type StoreInfoSchema = Input<typeof storeInfoSchema>
export type NewStoreSchema = Input<typeof newStoreSchema>
