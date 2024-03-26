"use client"

import { type FC } from "react"
import Link from "next/link"
import useCart from "@/store/useCart"

import { cn, getCartTotal } from "@/lib/utils"

import { buttonVariants } from "./ui/Button"
import { Separator } from "./ui/Separator"

interface CheckOutProps {}

const Checkout: FC<CheckOutProps> = ({}) => {
    const cartBooks = useCart((state) => state.cartBooks)
    return (
        <div className="shrink-0 text-sm font-semibold text-gray-900">
            <Separator className="mb-2" />
            <div className="flex items-center justify-between">
                <p>Shipping</p>
                <p>Free</p>
            </div>
            <div className="mt-2 flex items-center justify-between">
                <p>Taxes</p> <p>Calculated at checkout</p>
            </div>
            <Separator className="my-2" />

            <div className="mb-2 flex items-center justify-between">
                <p>Total</p> <p>{getCartTotal(cartBooks)}$</p>
            </div>
            <Link className={cn(buttonVariants(), "w-full")} href="/cart">
                Checkout
            </Link>
        </div>
    )
}

export default Checkout
