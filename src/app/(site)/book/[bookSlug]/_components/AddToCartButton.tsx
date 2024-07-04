"use client"

import { type FC } from "react"

import { useAddToCartButton } from "@/hooks/useAddToCartButton"
import { Button } from "@/components/ui/button"

interface AddToCartButtonProps {}

const AddToCartButton: FC<AddToCartButtonProps> = ({}) => {
    const { addToCart, isLoading } = useAddToCartButton()

    return (
        <Button onClick={addToCart} disabled={isLoading}>
            Add To Cart
        </Button>
    )
}

export default AddToCartButton
