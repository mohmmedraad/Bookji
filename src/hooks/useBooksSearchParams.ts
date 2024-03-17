import { useCallback } from "react"
import { useQueryState } from "nuqs"

import useDebounce from "./useDebounce"

export const useBooksSearchParams = () => {
    const [textParam, setTextParam] = useQueryState("text")
    const [authorParam, setAuthorParam] = useQueryState("author")
    const [priceParam, setPriceParam] = useQueryState("price")
    const [ratingParam, setRatingParam] = useQueryState("rating")
    const [inventoryParam, setInventoryParam] = useQueryState("inventory")
    const [categoriesParam, setCategoriesParam] = useQueryState("categories")
    const [pageParam, setPageParam] = useQueryState("page")
    const [sortByParam, setSortByParam] = useQueryState("sortBy")
    const [storesParam, setStoresParam] = useQueryState("stores")
    const [ordersParam, setOrdersParam] = useQueryState("orders")

    const text = useDebounce(textParam)
    const author = useDebounce(authorParam)
    const price = useDebounce(priceParam)
    const inventory = useDebounce(inventoryParam)
    const categories = useDebounce(categoriesParam)
    const rating = useDebounce(ratingParam)
    const page = useDebounce(pageParam)
    const sortBy = useDebounce(sortByParam)
    const stores = useDebounce(storesParam)
    const orders = useDebounce(ordersParam)

    const handleClearSearch = useCallback(() => {
        void setTextParam(null)
        void setAuthorParam(null)
        void setPageParam(null)
        void setPriceParam(null)
        void setRatingParam(null)
        void setInventoryParam(null)
        void setSortByParam(null)
        void setCategoriesParam(null)
        void setStoresParam(null)
        void setOrdersParam(null)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return {
        text,
        author,
        page,
        price,
        categories,
        rating,
        sortBy,
        stores,
        inventory,
        orders,
        handleClearSearch,
    }
}
