import { parseAsString, useQueryStates } from "nuqs"


export const useBooksSearchParams = () => {
    const [query] = useQueryStates({
        text: parseAsString,
        author: parseAsString,
        price: parseAsString,
        rating: parseAsString,
        inventory: parseAsString,
        categories: parseAsString,
        page: parseAsString,
        sortBy: parseAsString,
        stores: parseAsString,
        orders: parseAsString,
    })


    return {
        ...query,
    }
}
