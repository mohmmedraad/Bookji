import { useEffect, useState } from "react"
import { useQueryState } from "nuqs"

import useDebounce from "./useDebounce"

export const useBooksSearchParam = () => {
    const [textParam] = useQueryState("text")
    const [priceParam] = useQueryState("price")
    const [categoriesParam] = useQueryState("categories")
    const [ratingParam] = useQueryState("rating")
    const [pageParam] = useQueryState("page")
    const [sortByParam] = useQueryState("sortBy")
    const [storesParam] = useQueryState("stores")

    const text = useDebounce(textParam!)
    const price = useDebounce(priceParam!)
    const categories = useDebounce(categoriesParam!)
    const rating = useDebounce(ratingParam!)
    const page = useDebounce(pageParam!)
    const sortBy = useDebounce(sortByParam!)
    const stores = useDebounce(storesParam!)

    return {
        text,
        page,
        price,
        categories,
        rating,
        sortBy,
        stores,
    }
}
