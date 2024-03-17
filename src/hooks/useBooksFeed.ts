import { useEffect, useRef, useState } from "react"
import type { ShopPageBook } from "@/types"
import { useIntersection } from "@mantine/hooks"

import { trpc } from "@/app/_trpc/client"

import { useBooksSearchParams } from "./useBooksSearchParams"
import { useIsMount } from "./useIsMount"

export const useBooksFeed = (initialBooks: ShopPageBook[]) => {
    const searchParams = useBooksSearchParams()
    const [isInitialLoading, setIsInitialLoading] = useState(true)

    const lastBookRef = useRef<HTMLElement>(null)
    const { ref, entry } = useIntersection({
        root: lastBookRef.current,
        threshold: 1,
    })

    const {
        data,
        isFetchingNextPage,
        fetchNextPage,
        isFetching,
        isFetchedAfterMount,
    } = trpc.getBooks.useInfiniteQuery(
        {
            text: searchParams.text || "",
            author: searchParams.author || "",
            price: searchParams.price || "",
            rating: searchParams.rating || "",
            categories: searchParams.categories || "",
            stores: searchParams.stores || "",
            sortBy: searchParams.sortBy || "",
            inventory: searchParams.inventory || "",
            page: searchParams.page !== null ? +searchParams.page || 0 : 0,
        },
        {
            skip: true,
            getNextPageParam: (lastPage, pages) =>
                lastPage?.length !== 0 ? pages.length : undefined,
            // @ts-expect-error error
            initialData: { pages: [initialBooks], pageParams: [0] },
        }
    )

    useEffect(() => {
        const isIntersecting = entry?.isIntersecting
        if (isIntersecting) {
            void fetchNextPage()
        }
    }, [entry, fetchNextPage])

    useEffect(() => {
        if (!isFetchedAfterMount) return
        setIsInitialLoading(false)
    }, [isFetchedAfterMount])

    const books = data?.pages?.flatMap((page) => page)

    return {
        books,
        ref,
        isInitialLoading,
        isFetchingNextPage,
        isFetching,
    }
}
