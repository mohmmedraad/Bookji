import { type FC } from "react"
import Image from "next/image"
import Link from "next/link"
import { db } from "@/db"
import { currentUser } from "@clerk/nextjs"
import { and, eq } from "drizzle-orm"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card"

import CreateStoreForm from "./_components/CreateStoreForm"
import PageHeading from "./_components/PageHeading"
import { StoreLogo } from "./_components/StoreLogo"

interface pageProps {}

const Page: FC<pageProps> = async () => {
    const user = await currentUser()
    if (!user || !user.id) {
        return
    }

    const stores = await db.query.stores.findMany({
        where: (store) =>
            and(eq(store.ownerId, user.id), eq(store.isDeleted, false)),
    })

    return (
        <>
            {/**
             * TODO: Add suspense
             */}
            <PageHeading>Stores</PageHeading>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                <CreateStoreForm />
                {stores.map(
                    ({ name, description, logo, thumbnail, slug }, index) => (
                        <Link key={index} href={`/dashboard/${slug}`}>
                            <Card className="h-full overflow-hidden transition-shadow duration-300 hover:shadow-xl">
                                <div className="relative h-32 w-full">
                                    <Image
                                        alt={`${name} thumbnail`}
                                        src={thumbnail || "placeholder"}
                                        fill
                                        loading="eager"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <CardContent className="py-0">
                                    <StoreLogo
                                        logo={logo || "placeholder"}
                                        name={name}
                                        className="h-12 w-12 -translate-y-1/2 shadow-md"
                                    />
                                </CardContent>
                                <CardHeader className="pt-0">
                                    <CardTitle>{name}</CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        {description}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    )
                )}
            </div>
        </>
    )
}

export default Page
