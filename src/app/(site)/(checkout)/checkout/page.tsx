import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { getCachedUser } from "@/lib/utils/cachedResources"
import { buttonVariants } from "@/components/ui/button"
import Container from "@/components/ui/Container"

export const metadata: Metadata = {
    title: "Checkout",
    description:
        "Complete your book purchase securely on Bookji. select store books, and proceed to checkout.",
}

interface CheckoutPageProps {
    params: {
        success: string
    }
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
    const user = await getCachedUser()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { success } = params

    if (!user || !user?.id) {
        return redirect("/sign-in?_origin=checkout")
    }

    return (
        <section>
            <Container className="flex min-h-screen flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-bold md:text-4xl">
                    THANK YOU FOR PURCHASE
                </h2>
                <p className="mb-6 mt-4 max-w-md">
                    Your order has been placed successfully. You will receive an
                    email confirmation shortly.
                </p>
                <Link href="/shop" className={buttonVariants()}>
                    Continue Shopping
                </Link>
            </Container>
        </section>
    )
}
