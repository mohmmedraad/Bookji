import { type FC } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { getStripeAccountLink } from "@/server/utils"

import { cn, formatDate } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/Button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"

import ConnectToStripeButton from "./_components/ConnectToStripeButton"
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

    const { account: stripeAccount } = await getStripeAccountLink(store.id)

    console.log("stripeAccount: ", stripeAccount)

    return (
        <>
            <StoreInfo logo={store.logo} thumbnail={store.thumbnail} />
            <div className="grid items-start gap-8 pt-[52px] lg:grid-cols-updateStore">
                {stripeAccount ? (
                    <Card>
                        <CardHeader className="space-y-1">
                            <CardTitle className="line-clamp-1 text-2xl">
                                Manage Stripe account
                            </CardTitle>
                            <CardDescription>
                                Manage your Stripe account and view your payouts
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-5 sm:grid-cols-2">
                            <div className="grid gap-2.5">
                                <Label htmlFor="stripe-account-email">
                                    Email
                                </Label>
                                <Input
                                    id="stripe-account-email"
                                    name="stripeAccountEmail"
                                    readOnly
                                    defaultValue={stripeAccount.email ?? "N/A"}
                                />
                            </div>
                            <div className="grid gap-2.5">
                                <Label htmlFor="stripe-account-country">
                                    Country
                                </Label>
                                <Input
                                    id="stripe-account-country"
                                    name="stripeAccountCountry"
                                    readOnly
                                    defaultValue={stripeAccount.country}
                                />
                            </div>
                            <div className="grid gap-2.5">
                                <Label htmlFor="stripe-account-currency">
                                    Currency
                                </Label>
                                <Input
                                    id="stripe-account-currency"
                                    name="stripeAccountCurrency"
                                    className="uppercase"
                                    readOnly
                                    defaultValue={
                                        stripeAccount.default_currency
                                    }
                                />
                            </div>
                            <div className="grid gap-2.5">
                                <Label htmlFor="stripe-account-created">
                                    Created
                                </Label>
                                <Input
                                    id="stripe-account-created"
                                    name="stripeAccountCreated"
                                    readOnly
                                    defaultValue={
                                        stripeAccount.created
                                            ? formatDate(
                                                  stripeAccount.created * 1000
                                              )
                                            : "N/A"
                                    }
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Link
                                aria-label="Manage Stripe account"
                                href="https://dashboard.stripe.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                    buttonVariants({
                                        className: "text-center",
                                    })
                                )}
                            >
                                Manage Stripe account
                            </Link>
                        </CardFooter>
                    </Card>
                ) : (
                    <Card className="">
                        <CardHeader>
                            <CardTitle>Connect to stripe</CardTitle>
                            <CardDescription>
                                Connect your store to Stripe to start accepting
                                payments
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ConnectToStripeButton />
                        </CardContent>
                    </Card>
                )}
                <UpdateStoreForm
                    name={store.name}
                    description={store.description!}
                />
            </div>
        </>
    )
}

export default page
