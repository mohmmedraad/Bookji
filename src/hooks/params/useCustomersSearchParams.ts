import { parseAsString, useQueryStates } from "nuqs"

export const useCustomersSearchParams = () => {
    const [query] = useQueryStates({
        place: parseAsString,
        customers: parseAsString,
        page: parseAsString,
        sortBy: parseAsString,
        totalSpend: parseAsString,
        orders: parseAsString,
    })

    return {
        ...query,
    }
}
