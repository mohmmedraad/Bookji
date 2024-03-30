import { type FC } from "react"
import { type Metadata } from "next"
import { redirect } from "next/navigation"
import { Check } from "lucide-react"

import { subscriptionPlans } from "@/config/site"
import { getCachedUser } from "@/lib/utils/cachedResources"
import { getSubscriptionPlan } from "@/lib/utils/subscription"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card"
import { Separator } from "@/components/ui/Separator"

import PageHeading from "../_components/PageHeading"
import ManageSubscriptionButton from "./_components/ManageSubscriptionButton"

interface pageProps {}

export const metadata: Metadata = {
    title: "Billing",
    description:
        "Easily manage your billing details and payments on Bookji. Secure transactions and hassle-free invoicing.",
}

const Page: FC<pageProps> = async ({}) => {
    const user = await getCachedUser()

    if (!user) {
        return redirect("sign-in")
    }

    const subscriptionPlan = await getSubscriptionPlan(user.id)

    return (
        <div>
            <PageHeading>Billing</PageHeading>
            <p className="max-w-[750px] text-sm text-muted-foreground sm:text-base">
                Manage your billing and subscription
            </p>
            <Separator className="mt-6" />
            <h2 className="mb-6 mt-8 text-2xl font-bold">Subscription plans</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {Object.values(subscriptionPlans).map((plan, index) => (
                    <Card key={index}>
                        <CardHeader>
                            {plan.id === subscriptionPlan?.id ? (
                                <Badge className="max-w-max">
                                    Current Plan
                                </Badge>
                            ) : null}
                            <CardTitle>{plan.name}</CardTitle>
                            <CardDescription>
                                {plan.description}
                            </CardDescription>
                        </CardHeader>
                        <Separator className="my-8" />
                        <CardContent>
                            <div
                                aria-label={`${plan.name} price`}
                                className="text-5xl font-bold"
                            >
                                ${plan.price}
                                <span className="text-base">/mo</span>
                            </div>
                            {plan.id === "Basic" ? (
                                <Button className="mt-8 w-full">
                                    Get Started
                                </Button>
                            ) : (
                                <ManageSubscriptionButton
                                    stripePriceId={plan.stripePriceId}
                                    stripeCustomerId={
                                        subscriptionPlan?.stripeCustomerId
                                    }
                                    stripeSubscriptionId={
                                        subscriptionPlan?.stripeSubscriptionId
                                    }
                                    isSubscribed={
                                        subscriptionPlan?.isSubscribed ?? false
                                    }
                                    isCurrentPlan={
                                        subscriptionPlan?.name === plan.name
                                    }
                                />
                            )}

                            <Separator className="my-8" />
                            <div className="grid gap-4">
                                {plan.features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4"
                                    >
                                        <Check className="h-6 w-6 text-primary" />
                                        <p className="text-base text-gray-500">
                                            {feature}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default Page
