"use client"

import { type FC } from "react"

import useCart from "@/hooks/useCart"
import { trpc } from "@/app/_trpc/client"

import CartItem from "./CartItem"
import CartItems from "./CartItems"
import { Icons } from "./Icons"
import { Button } from "./ui/Button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./ui/Sheet"

const Cart: FC = () => {
    const setCartBooks = useCart((state) => state.setCartBooks)
    const { data, isError, isSuccess } = trpc.cart.get.useQuery()

    if (isSuccess) {
        console.log(data)
        setCartBooks(data || [])
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className="relative flex rounded-full bg-primary p-2.5">
                    <Icons.Cart width="16px" height="16px" />
                    <div className="absolute -right-2 -top-2 inline-flex h-6 w-6 items-center rounded-full border border-transparent bg-secondary p-2 text-xs font-semibold text-gray-900 transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                        {data?.length || 0}
                    </div>
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Cart</SheetTitle>
                </SheetHeader>
                <div className="grid grid-cols-cart">
                    <CartItems />
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default Cart
