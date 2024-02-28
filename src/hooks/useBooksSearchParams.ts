import { useCallback } from "react"
import { useQueryState } from "nuqs"

import useDebounce from "./useDebounce"

function isNotNull(value: string | null) {
    return value !== null
}

export const useBooksSearchParams = () => {
    const [textParam, setTextParam] = useQueryState("text")
    const [priceParam, setPriceParam] = useQueryState("price")
    const [ratingParam, setRatingParam] = useQueryState("rating")
    const [inventoryParam, setInventoryParam] = useQueryState("inventory")
    const [categoriesParam, setCategoriesParam] = useQueryState("categories")
    const [pageParam, setPageParam] = useQueryState("page")
    const [sortByParam, setSortByParam] = useQueryState("sortBy")
    const [storesParam, setStoresParam] = useQueryState("stores")

    const text = useDebounce(textParam)
    const price = useDebounce(priceParam)
    const inventory = useDebounce(inventoryParam)
    const categories = useDebounce(categoriesParam)
    const rating = useDebounce(ratingParam)
    const page = useDebounce(pageParam)
    const sortBy = useDebounce(sortByParam)
    const stores = useDebounce(storesParam)

    const handleClearSearch = useCallback(() => {
        isNotNull(textParam) && void setTextParam(null)
        isNotNull(pageParam) && void setPageParam(null)
        isNotNull(priceParam) && void setPriceParam(null)
        isNotNull(ratingParam) && void setRatingParam(null)
        isNotNull(inventoryParam) && void setInventoryParam(null)
        isNotNull(sortByParam) && void setSortByParam(null)
        isNotNull(categoriesParam) && void setCategoriesParam(null)
        isNotNull(storesParam) && void setStoresParam(null)
    }, [
        categoriesParam,
        pageParam,
        priceParam,
        ratingParam,
        sortByParam,
        storesParam,
        textParam,
        inventoryParam,
        setInventoryParam,
        setCategoriesParam,
        setPageParam,
        setPriceParam,
        setRatingParam,
        setSortByParam,
        setStoresParam,
        setTextParam,
    ])

    return {
        text,
        page,
        price,
        categories,
        rating,
        sortBy,
        stores,
        inventory,
        handleClearSearch,
    }
}
