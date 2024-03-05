import { useCallback } from "react"
import { useQueryState } from "nuqs"

import useDebounce from "./useDebounce"

export const useCustomersSearchParams = () => {
    const [placeParam, setPlaceParam] = useQueryState("place")
    const [customersParam, setCustomersParam] = useQueryState("customers")
    const [totalSpendParam, setTotalSpendParam] = useQueryState("total_spend")
    const [ordersParam, setOrdersParam] = useQueryState("total_orders")
    const [pageParam, setPageParam] = useQueryState("page")
    const [sortByParam, setSortByParam] = useQueryState("sortBy")

    const place = useDebounce(placeParam)
    const customers = useDebounce(customersParam)
    const page = useDebounce(pageParam)
    const sortBy = useDebounce(sortByParam)
    const totalSpend = useDebounce(totalSpendParam)
    const orders = useDebounce(ordersParam)

    const handleClearSearch = useCallback(() => {
        void setPageParam(null)
        void setPlaceParam(null)
        void setSortByParam(null)
        void setCustomersParam(null)
        void setTotalSpendParam(null)
        void setOrdersParam(null)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return {
        page,
        customers,
        sortBy,
        totalSpend,
        place,
        orders,
        handleClearSearch,
    }
}
