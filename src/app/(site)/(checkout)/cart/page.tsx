import { type FC } from "react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { db } from "@/db"
import { books, carts } from "@/db/schema"
import { currentUser } from "@clerk/nextjs"
import { eq, sql } from "drizzle-orm"

import { buttonVariants } from "@/components/ui/Button"
import Container from "@/components/ui/Container"

import StoreCheckoutCard from "./_components/StoreCheckoutCard"

interface PageProps {}

const Page: FC<PageProps> = async ({}) => {
    const user = await currentUser()

    if (!user || !user.id) {
        return redirect("sign-in")
    }

    const userCart = await db.query.carts.findFirst({
        columns: {
            id: true,
            items: true,
        },
        where: (cart, { eq }) => eq(cart.userId, user.id),
    })

    if (!userCart || !userCart.id) {
        return notFound()
    }

    const cartItemsStoresIds = await db
        .selectDistinct({ storeId: books.storeId })
        .from(carts)
        .leftJoin(
            books,
            sql`JSON_CONTAINS(Bookji_carts.items, JSON_OBJECT('bookId', Bookji_books.id))`
        )
        .groupBy(books.storeId)
        .where(eq(carts.id, Number(userCart.id)))

    const isCartEmpty =
        cartItemsStoresIds.length === 1 &&
        cartItemsStoresIds[0].storeId === null
    return (
        <section>
            <Container className="grid min-h-screen gap-8 pb-20 pt-40">
                {isCartEmpty ? (
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
                    cartItemsStoresIds.map((store) => (
                        <StoreCheckoutCard
                            key={store.storeId}
                            storeId={store.storeId!}
                        />
                    ))
                )}
            </Container>
        </section>
    )
}

export default Page
