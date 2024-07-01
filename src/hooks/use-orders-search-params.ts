import { parseAsString, useQueryStates } from "nuqs"

export const useOrdersSearchParams = () => {
    const [query] = useQueryStates({
        text: parseAsString,
        total: parseAsString,
        email: parseAsString,
        state: parseAsString,
        city: parseAsString,
        page: parseAsString,
        sortBy: parseAsString,
        country: parseAsString,
        customers: parseAsString,
    })

    return {
        ...query,
    }
}
