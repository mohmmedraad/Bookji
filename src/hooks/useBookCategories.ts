import { trpc } from "@/app/_trpc/client"

interface UseBookCategories {
    bookId: number
}

export const useBookCategories = ({ bookId }: UseBookCategories) => {
    const query = trpc.getBookCategories.useQuery({ bookId })
    console.log("categories: ", query?.data)
    return query
}
