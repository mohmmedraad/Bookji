import { type FC } from "react"
import { type Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { getCachedUser } from "@/lib/utils/cachedResources"
import { getCart } from "@/lib/utils/cart"
import { buttonVariants } from "@/components/ui/button"
import Container from "@/components/ui/Container"

import StoreCheckoutCard from "./_components/StoreCheckoutCard"

export const metadata: Metadata = {
    title: "Cart",
    description:
        "Review and manage items in your Bookji shopping cart. Easily add, remove, or update quantities before checkout.",
}

interface PageProps {}

const Page: FC<PageProps> = async ({}) => {
    const user = await getCachedUser()

    if (!user || !user.id) {
        return redirect("/sign-in?_origin=cart")
    }

    const userCart = await getCart(user.id)

    if (!userCart || !userCart.id) {
        return notFound()
    }

    const cartItemsStoresIds = new Set(
        userCart.items.map((item) => item.storeId)
    )
    return (
        <section>
            <Container className="grid min-h-screen gap-8 pb-20 pt-40">
                {cartItemsStoresIds.size === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-4">
                        <p className="text-2xl font-semibold text-gray-500">
                            Your cart is empty
                        </p>
                        <div className="grid gap-2 xs:grid-cols-2">
                            <Link href="/shop" className={buttonVariants()}>
                                Start Perches
                            </Link>
                            <Link
                                href="/"
                                className={buttonVariants({
                                    variant: "outline",
                                })}
                            >
                                Home
                            </Link>
                        </div>
                    </div>
                ) : (
                    [...cartItemsStoresIds].map((storeId) => (
                        <StoreCheckoutCard key={storeId} storeId={storeId} />
                    ))
                )}
            </Container>
        </section>
    )
}

export default Page
