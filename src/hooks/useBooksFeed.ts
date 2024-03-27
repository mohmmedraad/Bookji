import { useEffect, useRef, useState } from "react"
import type { ShopPageBook } from "@/types"
import { useIntersection } from "@mantine/hooks"

import { trpc } from "@/app/_trpc/client"

import { useBooksSearchParams } from "./useBooksSearchParams"

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
    } = trpc.books.get.useInfiniteQuery(
        {
            text: searchParams.text || "",
            author: searchParams.author || "",
            // @ts-expect-error error
            price: searchParams.price || "",
            // @ts-expect-error error
            rating: searchParams.rating || "",
            // @ts-expect-error error
            categories: searchParams.categories || "",
            // @ts-expect-error error
            stores: searchParams.stores || "",
            // @ts-expect-error error
            sortBy: searchParams.sortBy || "",
            // @ts-expect-error error
            inventory: searchParams.inventory || "",
            page: searchParams.page !== null ? +searchParams.page || 0 : 0,
        },
        {
            skip: true,
            getNextPageParam: (lastPage, pages) =>
                lastPage?.length !== 0 ? pages.length : undefined,
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
