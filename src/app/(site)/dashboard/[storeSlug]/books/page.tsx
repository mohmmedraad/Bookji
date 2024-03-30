import { type FC } from "react"
import { type Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { type SearchParams } from "@/types"

import { searchParamsString, title } from "@/lib/utils"
import { getCachedStore, getCachedUser } from "@/lib/utils/cachedResources"
import { getStoreBooks } from "@/lib/utils/store"

import BooksTable from "./_components/BooksTable"

interface pageProps {
    params: {
        storeSlug: string
    }
    searchParams: SearchParams
}

export const generateMetadata = async ({
    params: { storeSlug },
}: pageProps): Promise<Metadata | undefined> => {
    const user = await getCachedUser()

    if (!user || !user.id) {
        return
    }

    const store = await getCachedStore(storeSlug, user.id)

    if (!store) {
        return
    }

    return {
        title: "Books",
        description: `Explore exclusive books curated for your ${title(
            store.name
        )} store, this collection allows you to curate your inventory and showcase unique reads to your customers.`,
    }
}

const Page: FC<pageProps> = async ({ params: { storeSlug }, searchParams }) => {
    const user = await getCachedUser()

    if (!user?.id)
        return redirect(
            `/sign-in?_origin=/dashboard/${storeSlug}/books?${searchParamsString(
                searchParams
            )}`
        )

    const store = await getCachedStore(storeSlug, user.id)

    if (!store) return notFound()

    const userBooks = await getStoreBooks(user.id, store.id, searchParams)

    return <BooksTable initialBooks={userBooks} />
}

export default Page
