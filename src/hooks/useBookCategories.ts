import { trpc } from "@/app/_trpc/client"

interface UseBookCategories {
    bookId: number
}

export const useBookCategories = ({ bookId }: UseBookCategories) => {
    const query = trpc.books.bookCategories.useQuery({ bookId })
    return query
}
