import { type FC } from "react"
import { redirect } from "next/navigation"
import { getSubscriptionPlan } from "@/server/fetchers"
import { currentUser } from "@clerk/nextjs"
import { Check } from "lucide-react"

import { storeSubscriptionPlans } from "@/config/site"
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

const Page: FC<pageProps> = async ({}) => {
    const user = await currentUser()
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
                {storeSubscriptionPlans.map((plan, index) => (
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
                            {plan.id === "basic" ? (
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
