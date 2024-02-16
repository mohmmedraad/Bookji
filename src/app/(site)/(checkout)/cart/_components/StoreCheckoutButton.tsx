import { type FC } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { type ExtendedCartItem } from "@/hooks/useCart"
import { Button } from "@/components/ui/Button"
import { trpc } from "@/app/_trpc/client"

interface StoreCheckoutButtonProps {
    storeId: number
    items: ExtendedCartItem[]
}

const StoreCheckoutButton: FC<StoreCheckoutButtonProps> = ({
    storeId,
    items,
}) => {
    const router = useRouter()

    // const { isLoading, mutate } = trpc.stripe.createPaymentIntent.useMutation({
    //     onSuccess: ({ clientSecret }) => {
    //         try {
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     },
    //     onError: (error) => {
    //         const errorCode = error.data?.code
    //         if (errorCode === "UNAUTHORIZED") {
    //             router.push("/sign-in?origin=/cart")
    //             return toast.error("You need to be logged in to checkout")
    //         }

    //         if (errorCode === "NOT_FOUND") {
    //             return toast.error(error.message)
    //         }
    //         return handleGenericError()
    //     },
    // })

    const amount = items.reduce(
        (total, item) => total + item.quantity * Number(item.price),
        0
    )

    const { mutate, isLoading } = trpc.stripe.createCheckoutSession.useMutation(
        {
            onSuccess: (session) => {
                router.push(session.url)
            },
            onError: (error) => {
                const errorCode = error.data?.code
                if (errorCode === "UNAUTHORIZED") {
                    router.push("/sign-in?origin=/cart")
                    return toast.error("You need to be logged in to checkout")
                }

                if (errorCode === "NOT_FOUND") {
                    return toast.error(error.message)
                }

                console.log("error: ", error)
                console.log("error code: ", error.data?.code)
                return toast.error(
                    "An error occurred while creating checkout session. Please try again later."
                )
            },
        }
    )

    return (
        <>
            <Button
                className="w-full"
                disabled={isLoading}
                onClick={() => mutate({ storeId, amount })}
            >
                Checkout
            </Button>
        </>
    )
}

export default StoreCheckoutButton
