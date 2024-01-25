import { type FC } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/db"

import { buttonVariants } from "@/components/ui/Button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card"

import UpdateStoreForm from "./_components/UpdateStoreForm"
import StoreInfo from "./_sections/StoreInfo"

interface pageProps {
    params: {
        storeSlug: string
    }
}

const page: FC<pageProps> = async ({ params: { storeSlug } }) => {
    const store = await db.query.stores.findFirst({
        where: (store, { eq }) => eq(store.slug, storeSlug),
    })

    if (!store) {
        return notFound()
    }

    return (
        <>
            <StoreInfo logo={store.logo} thumbnail={store.thumbnail} />
            <div className="grid items-start gap-8 pt-[52px] md:grid-cols-updateStore">
                <Card>
                    <CardHeader>
                        <CardTitle>Connect to stripe</CardTitle>
                        <CardDescription>
                            Connect your store to Stripe to start accepting
                            payments
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href={"/"} className={buttonVariants()}>
                            Connect to Stripe
                        </Link>
                    </CardContent>
                </Card>
                <UpdateStoreForm
                    name={store.name}
                    description={store.description!}
                />
            </div>
        </>
    )
}

export default page
