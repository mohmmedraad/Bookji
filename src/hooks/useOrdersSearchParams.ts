import { useCallback } from "react"
import { useQueryState } from "nuqs"

import useDebounce from "./useDebounce"

function isNotNull(value: string | null) {
    return value !== null
}

export const useOrdersSearchParams = () => {
    const [textParam, setTextParam] = useQueryState("text")
    const [totalParam, setTotalParam] = useQueryState("total")
    const [cityParam, setCityParam] = useQueryState("city")
    const [emailParam, setEmailParam] = useQueryState("email")
    const [stateParam, setStateParam] = useQueryState("state")
    const [countryParam, setCountryParam] = useQueryState("country")
    const [pageParam, setPageParam] = useQueryState("page")
    const [sortByParam, setSortByParam] = useQueryState("sortBy")

    const text = useDebounce(textParam)
    const total = useDebounce(totalParam)
    const email = useDebounce(emailParam)
    const state = useDebounce(stateParam)
    const city = useDebounce(cityParam)
    const page = useDebounce(pageParam)
    const sortBy = useDebounce(sortByParam)
    const country = useDebounce(countryParam)

    const handleClearSearch = useCallback(() => {
        void setTextParam((prev) => (isNotNull(prev) ? null : prev))
        void setTotalParam((prev) => (isNotNull(prev) ? null : prev))
        void setCityParam((prev) => (isNotNull(prev) ? null : prev))
        void setEmailParam((prev) => (isNotNull(prev) ? null : prev))
        void setStateParam((prev) => (isNotNull(prev) ? null : prev))
        void setCountryParam((prev) => (isNotNull(prev) ? null : prev))
        void setPageParam((prev) => (isNotNull(prev) ? null : prev))
        void setSortByParam((prev) => (isNotNull(prev) ? null : prev))
    }, [])

    return {
        text,
        page,
        total,
        state,
        city,
        sortBy,
        country,
        email,
        handleClearSearch,
    }
}
