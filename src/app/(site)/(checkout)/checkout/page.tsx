import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs"

import { buttonVariants } from "@/components/ui/Button"
import Container from "@/components/ui/Container"

export const metadata: Metadata = {
    // metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: "Checkout",
    description: "Checkout with store items",
}

interface CheckoutPageProps {
    params: {
        success: string
    }
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
    const user = await currentUser()
    const { success } = params

    if (!user || !user?.id) {
        return notFound()
    }

    // if (success !== "true") {
    //     return redirect("/shop")
    // }

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
