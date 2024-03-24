import { type FC } from "react"
import { notFound, redirect } from "next/navigation"
import { type SearchParams } from "@/types"

import { searchParamsString } from "@/lib/utils"
import { getCachedStore, getCachedUser } from "@/lib/utils/cachedResources"
import { getStoreBooks } from "@/lib/utils/store"

import BooksTable from "./_components/BooksTable"

interface pageProps {
    params: {
        storeSlug: string
    }
    searchParams: SearchParams
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
