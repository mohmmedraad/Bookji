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

    const text = useDebounce(textParam!, 500)
    const price = useDebounce(priceParam!, 300)
    const categories = useDebounce(categoriesParam!, 300)
    const rating = useDebounce(ratingParam!, 300)
    const page = useDebounce(pageParam!, 300)
    const sortBy = useDebounce(sortByParam!, 300)
    const stores = useDebounce(storesParam!, 300)

    return { text, price, categories, rating, page, sortBy, stores }
}
