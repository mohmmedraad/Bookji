import { parseAsString, useQueryStates } from "nuqs"

export const usePurchasesSearchParams = () => {
    const [query] = useQueryStates({
        text: parseAsString,
        total: parseAsString,
        page: parseAsString,
        sortBy: parseAsString,
        stores: parseAsString,
    })

    return {
        ...query,
    }
}
