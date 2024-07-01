import { type FC } from "react"
import { type Metadata } from "next"
import type { SearchParams } from "@/types"
import { parse } from "valibot"

import { getShopPageBooks } from "@/lib/utils/store"
import { getBooksSchema } from "@/lib/validations/book"
import Container from "@/components/ui/container"

import BooksFeed from "./_sections/BooksFeed"
import FilterBar from "./_sections/FilterBar"

interface PageProps {
    searchParams: SearchParams
}

export const metadata: Metadata = {
    title: "Shop",
    description:
        "Explore a wide range of books on Bookji Shop. Find your next favorite read, from bestsellers to hidden gems.",
}

const Page: FC<PageProps> = async ({ searchParams }) => {
    const input = parse(getBooksSchema, searchParams)

    const books = await getShopPageBooks({ ...input })

    const initialBooks = books
    return (
        <main className="min-h-screen pb-8 pt-32">
            <Container>
                <FilterBar />
                <BooksFeed initialBooks={initialBooks} />
            </Container>
        </main>
    )
}

export default Page
