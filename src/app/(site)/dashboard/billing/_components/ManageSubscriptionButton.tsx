"use client"

import { type FC } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { handleGenericError } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { trpc } from "@/app/_trpc/client"

interface ManageSubscriptionButtonProps {
    isCurrentPlan: boolean
    stripeSubscriptionId?: string | null
    stripeCurrentPeriodEnd?: string | null
    stripeCustomerId?: string | null
    isSubscribed: boolean
    stripePriceId: string
}

const ManageSubscriptionButton: FC<ManageSubscriptionButtonProps> = ({
    isCurrentPlan,
    isSubscribed,
    stripeCustomerId,
    stripeSubscriptionId,
    stripePriceId,
}) => {
    const router = useRouter()

    const { mutate: manageSubscription, isLoading } =
        trpc.stripe.manageSubscription.useMutation({
            onSuccess: ({ url }) => {
                return router.push(url ?? "/dashboard/billing")
            },
            onError: (error) => {
                console.log(error)
                const errorCode = error.data?.code
                if (errorCode === "UNAUTHORIZED") {
                    toast.error(
                        "You must be signed in to manage your subscription."
                    )
                    return router.push("/sign-in?_origin=/dashboard/billing")
                }

                return handleGenericError()
            },
        })

    function handleClick() {
        manageSubscription({
            isCurrentPlan,
            isSubscribed,
            stripePriceId,
            stripeCustomerId,
            stripeSubscriptionId,
        })
    }
    return (
        <Button
            onClick={handleClick}
            disabled={isLoading}
            className="mt-8 w-full"
        >
            {isCurrentPlan ? "Manage" : "Subscribe"}
        </Button>
    )
}

export default ManageSubscriptionButton
