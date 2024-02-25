import { useEffect, useRef } from "react"
import { type PartialBook } from "@/types"
import { useIntersection } from "@mantine/hooks"

import { trpc } from "@/app/_trpc/client"

import { useBooksSearchParams } from "./useBooksSearchParams"
import { useIsMount } from "./useIsMount"

interface ExtendedBooksType extends PartialBook {
    userFullName: string | undefined
}

export const useBooksFeed = (initialBooks: ExtendedBooksType[]) => {
    const searchParams = useBooksSearchParams()
    const isMount = useIsMount()

    const lastBookRef = useRef<HTMLElement>(null)
    const { ref, entry } = useIntersection({
        root: lastBookRef.current,
        threshold: 1,
    })

    const { data, isFetchingNextPage, fetchNextPage, isFetching } =
        trpc.getBooks.useInfiniteQuery(
            {
                ...searchParams,
                page: searchParams.page !== null ? +searchParams.page || 0 : 0,
            },
            {
                getNextPageParam: (lastPage, pages) =>
                    lastPage?.length !== 0 ? pages.length : undefined,
                // @ts-expect-error incorrect type
                initialData: { pages: [initialBooks], pageParams: [0] },
            }
        )

    useEffect(() => {
        const isIntersecting = entry?.isIntersecting
        if (isIntersecting) {
            void fetchNextPage()
        }
    }, [entry, fetchNextPage])

    const books = data?.pages?.flatMap((page) => page)

    return {
        books,
        ref,
        isMount,
        isFetchingNextPage,
        isFetching,
    }
}
