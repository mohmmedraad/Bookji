import { type FC } from "react"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { currentUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"
import { Plus } from "lucide-react"

import { getCurrentPageNumber } from "@/lib/utils"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card"
import { DataTable } from "@/components/ui/DataTable"
import { Columns } from "@/components/MyBooksColumns"

import PageHeading from "./_components/PageHeading"
import { StoreLogo } from "./_components/StoreLogo"

interface pageProps {
    searchParams: {
        _page: string | undefined
    }
}

const stores = [
    {
        name: "Book Store",
        description: "A store for books",
        logo: "/img-1.webp",
        thumbnail: "/default-thumbnail.png",
    },
    {
        name: "Book Store 2",
        description: "A store for books 2",
        logo: "/img-1.webp",
        thumbnail: "/default-thumbnail.png",
    },
]

const Page: FC<pageProps> = async ({ searchParams }) => {
    const currentPage = getCurrentPageNumber(searchParams?._page)
    const user = await currentUser()
    if (!user || !user.id) {
        return
    }

    // const userBooks = await db.query.books.findMany({
    //     offset: currentPage * 10,
    //     limit: 10,
    //     where: (book) => eq(book.userId, user.id),
    // })

    return (
        <>
            {/**
             * TODO: Add suspense
             */}
            <PageHeading>Stores</PageHeading>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                <button>
                    <Card className="flex h-60 flex-col items-center justify-center gap-6 transition-shadow duration-300 hover:shadow-xl sm:h-full">
                        <Plus className="h-8 w-8 text-primary" />
                        <p className="text-sm text-primary">Add Store</p>
                    </Card>
                </button>
                {stores.map(({ name, description, logo, thumbnail }, index) => (
                    <Link key={index} href={`/dashboard/stores/${name}`}>
                        <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-xl">
                            <Image
                                alt={`${name} thumbnail`}
                                src={thumbnail}
                                width={48}
                                height={48}
                                className="h-32 w-full object-cover"
                            />
                            <CardContent className="py-0">
                                <StoreLogo
                                    logo={logo}
                                    name={name}
                                    className="h-12 w-12 -translate-y-1/2 shadow-md"
                                />
                            </CardContent>
                            <CardHeader className="pt-0">
                                <CardTitle>{name}</CardTitle>
                                <CardDescription className="line-clamp-3">
                                    {description}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
            {/* <DataTable
                columns={Columns}
                data={userBooks}
                url="/profile"
                currentPage={currentPage}
            /> */}
        </>
    )
}

export default Page
