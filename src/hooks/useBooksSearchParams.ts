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

    const text = useDebounce(textParam!)
    const price = useDebounce(priceParam!)
    const inventory = useDebounce(inventoryParam!)
    const categories = useDebounce(categoriesParam!)
    const rating = useDebounce(ratingParam!)
    const page = useDebounce(pageParam!)
    const sortBy = useDebounce(sortByParam!)
    const stores = useDebounce(storesParam!)

    const handleClearSearch = useCallback(() => {
        isNotNull(textParam) && void setTextParam("")
        isNotNull(pageParam) && void setPageParam("")
        isNotNull(priceParam) && void setPriceParam("0-500")
        isNotNull(ratingParam) && void setRatingParam("0-5")
        isNotNull(inventoryParam) && void setInventoryParam("0-100")
        isNotNull(sortByParam) && void setSortByParam("")
        isNotNull(categoriesParam) && void setCategoriesParam("")
        isNotNull(storesParam) && void setStoresParam("")
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
