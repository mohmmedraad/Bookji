import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

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

export default function CheckoutPage({ params }: CheckoutPageProps) {
    const { success } = params

    // if (success !== "true") {
    //     return redirect("/shop")
    // }

    return (
        <section className="pt-40">
            <Container className="flex min-h-screen items-center justify-center">
                <h2 className="text-2xl font-bold md:text-4xl">
                    THANK YOU FOR PURCHASE
                </h2>
                <p className="mb-6 mt-4">
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
