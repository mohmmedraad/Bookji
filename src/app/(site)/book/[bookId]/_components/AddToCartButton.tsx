"use client"

import { type FC } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/Button"

interface AddToCartButtonProps {
    bookId: string
}

const AddToCartButton: FC<AddToCartButtonProps> = ({ bookId }) => {
    function addToCart() {
        console.log(bookId)
        toast.success("Added to cart")
    }
    return <Button onClick={addToCart}>Add To Cart</Button>
}

export default AddToCartButton
