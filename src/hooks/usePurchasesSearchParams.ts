import { useCallback } from "react"
import { useQueryState } from "nuqs"

import useDebounce from "./useDebounce"

export const usePurchasesSearchParams = () => {
    const [textParam, setTextParam] = useQueryState("text")
    const [totalParam, setTotalParam] = useQueryState("total")
    const [pageParam, setPageParam] = useQueryState("page")
    const [sortByParam, setSortByParam] = useQueryState("sortBy")
    const [storesParam, setStoresParam] = useQueryState("stores")

    const text = useDebounce(textParam)
    const total = useDebounce(totalParam)
    const page = useDebounce(pageParam)
    const sortBy = useDebounce(sortByParam)
    const stores = useDebounce(storesParam)

    const handleClearSearch = useCallback(() => {
        void setTextParam(null)
        void setTotalParam(null)
        void setPageParam(null)
        void setSortByParam(null)
        void setStoresParam(null)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return {
        text,
        page,
        total,
        sortBy,
        stores,
        handleClearSearch,
    }
}
