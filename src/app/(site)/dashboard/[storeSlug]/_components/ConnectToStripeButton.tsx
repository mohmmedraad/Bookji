"use client"

import { type FC } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/store/useStore"
import { toast } from "sonner"

import { handleGenericError } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { trpc } from "@/app/_trpc/client"

interface conectToStripeButtonProps {}

const ConnectToStripeButton: FC<conectToStripeButtonProps> = ({}) => {
    const { id: storeId, slug: storeSlug } = useStore()
    const router = useRouter()
    const { mutate, isLoading } = trpc.stripe.createAccountLink.useMutation({
        onError: (error) => {
            const errorCode = error.data?.code

            if (errorCode === "UNAUTHORIZED") {
                toast.error("You need to be signed in to connect to Stripe")
                return router.push(`/sign-in?_origin=dashboard/${storeSlug}`)
            }

            if (errorCode === "CONFLICT") {
                toast.error("You already have a Stripe account connected")
                return router.push(`/dashboard/${storeSlug}`)
            }

            return handleGenericError()
        },
        onSuccess: (data) => {
            router.push(data)
        },
    })

    function handleOnClick() {
        mutate({ storeId, storeSlug: storeSlug! })
    }
    return (
        <Button onClick={handleOnClick} disabled={isLoading}>
            Connect to Stripe
        </Button>
    )
}

export default ConnectToStripeButton
