import { type FC } from "react"
import { type Metadata } from "next"
import { notFound } from "next/navigation"

import { site } from "@/config/site"
import { title } from "@/lib/utils"
import { getBook } from "@/lib/utils/cachedResources"
import Book from "@/components/ui/book-cover"
import Container from "@/components/ui/Container"
import BookProvider from "@/components/BookProvider"
import { Icons } from "@/components/Icons"

import BookInfo from "./_sections/BookInfo"
import StoresBooks from "./_sections/StoresBooks"

interface pageProps {
    params: {
        bookSlug: string
    }
}

export const generateMetadata = async ({
    params: { bookSlug },
}: pageProps): Promise<Metadata> => {
    const book = await getBook(bookSlug)

    if (!book) {
        return {}
    }

    return {
        metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
        title: title(book.title),
        description: book.description,
        authors: [{ name: book.author }],
        creator: book.storeName,
        generator: "Next.js",
        openGraph: {
            type: "website",
            locale: "en_US",
            title: book.title,
            siteName: site.name,
            description: book.description!,
            url: `${site.url}/book/${book.slug}`,
            images: book.cover!,
        },
        twitter: {
            card: "summary_large_image",
            title: book.title,
            description: book.description!,
            images: book.cover!,
        },
    }
}

const Page: FC<pageProps> = async ({ params: { bookSlug } }) => {
    const book = await getBook(bookSlug)

    if (!book) {
        return notFound()
    }

    return (
        <section className="overflow-x-clip">
            <BookProvider {...book} />
            <Container className="grid gap-48 pt-40 md:grid-cols-2 lg:gap-14 xl:grid-cols-bookPage xl:justify-between">
                <div className="grid items-start justify-center lg:block">
                    <div className="sticky top-24">
                        <Book
                            alt="book cover"
                            className="h-[340px] w-[230px] sm:h-[420px] sm:w-[280px]"
                            width={240}
                            height={420}
                            src={book.cover!}
                            priority={true}
                            loading="eager"
                        />
                        <Icons.Polygon className="absolute top-0 z-[-1] translate-x-[-35%] translate-y-[-14%] rotate-[-23.97deg] text-[#32166D]" />
                        <Icons.Polygon className="absolute bottom-0 z-[-1] translate-x-[12%] translate-y-[26%] rotate-[62.75deg] text-[#F97316]" />
                    </div>
                </div>

                <BookInfo bookSlug={book.slug} />

                <div className="hidden xl:block">
                    <h4 className="mb-8 text-sm font-bold text-gray-900">
                        BOOKS BY THIS STORE
                    </h4>
                    <div className="sticky top-14 h-[calc(100vh-160px)] ">
                        <StoresBooks />
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default Page
