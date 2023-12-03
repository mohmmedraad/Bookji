"use client"

import { type FC } from "react"
import { useRouter } from "next/navigation"
import { TRPCClientError } from "@trpc/client"
import { TRPCError } from "@trpc/server"
import { toast } from "sonner"

import { handleGenericError } from "@/lib/utils"
import useCart from "@/hooks/useCart"
import { Button } from "@/components/ui/Button"
import { trpc } from "@/app/_trpc/client"

interface AddToCartButtonProps {
    bookId: string
}

const AddToCartButton: FC<AddToCartButtonProps> = ({ bookId }) => {
    const { addBook, undoChanging } = useCart((store) => ({
        addBook: store.addBook,
        undoChanging: store.undoChanging,
    }))
    const router = useRouter()
    const { data, mutate: addToCart } = trpc.cart.add.useMutation({
        onMutate: () => {
            addBook({ bookId, quantity: 1 })
            toast.success("Added to cart")
        },
        onError: (error) => {
            undoChanging()
            handleTRPCError(error.data?.code)
        },
    })

    function handleTRPCError(errorCode: TRPCError["code"] | undefined) {
        if (errorCode === "UNAUTHORIZED") {
            toast.error("Please login first")
            router.push("/sign-in")
        }
        return handleGenericError()
    }

    function handleClick() {
        addToCart({ bookId, quantity: 1 })
    }
    return <Button onClick={handleClick}>Add To Cart</Button>
}

export default AddToCartButton
