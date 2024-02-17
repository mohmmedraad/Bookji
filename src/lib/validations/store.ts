import {
    blob,
    maxLength,
    maxSize,
    merge,
    mimeType,
    minLength,
    number,
    object,
    partial,
    string,
    toTrimmed,
    url,
    value,
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

export const newStoreSchema = object({
    name: string([
        minLength(10, "the name must be at least 10 character long"),
        maxLength(50, "the name must be below the 50 character"),
        toTrimmed(),
    ]),
    description: string([
        minLength(25, "the description must be at least 25 character long"),
    ]),
    logo: string([url()]),
    thumbnail: string([url()]),
})

export const updateStoreSchema = merge([
    partial(newStoreSchema),
    object({
        storeId: number(),
    }),
])

export const storeLogoSchema = blob([
    mimeType(
        ["image/webp", "image/png", "image/jpg", "image/jpeg"],
        "Only images of type webp, png and jpg are allowed"
    ),
    maxSize(1_048_576, "File size must be less than 1MB"),
])

export const storeThumbnailSchema = blob([
    mimeType(
        ["image/webp", "image/png", "image/jpg", "image/jpeg"],
        "Only images of type webp, png and jpg are allowed"
    ),
    maxSize(2_097_152, "File size must be less than 2MB"),
])

export const deleteStoreSchema = object({
    storeId: number(),
})

export type StoreInfoSchema = Input<typeof storeInfoSchema>
export type NewStoreSchema = Input<typeof newStoreSchema>
export type UpdateStoreSchema = Input<typeof updateStoreSchema>
