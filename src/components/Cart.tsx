"use client"

import { type FC } from "react"

import useCart from "@/hooks/useCart"
import { trpc } from "@/app/_trpc/client"

import CartItems from "./CartItems"
import Checkout from "./Checkout"
import { Icons } from "./Icons"
import { Button } from "./ui/Button"
import { Separator } from "./ui/Separator"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./ui/Sheet"

const Cart: FC = () => {
    const setCartBooks = useCart((state) => state.setCartBooks)
    const cartBooks = useCart((state) => state.cartBooks)
    const { isSuccess } = trpc.cart.get.useQuery(
        // @ts-expect-error error
        {},
        {
            onSuccess: (data) => {
                setCartBooks(data || [])
            },
        }
    )

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className="relative flex rounded-full bg-primary p-2.5">
                    <Icons.Cart width="16px" height="16px" />
                    <div className="absolute -right-2 -top-2 inline-flex h-6 w-6 items-center rounded-full border border-transparent bg-secondary p-2 text-xs font-semibold text-gray-900 transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                        {cartBooks?.length || 0}
                    </div>
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full">
                <SheetHeader>
                    <SheetTitle>
                        Cart{"("}
                        {cartBooks?.length || 0}
                        {")"}
                    </SheetTitle>
                    <Separator className="mt-4" />
                </SheetHeader>
                <div className="flex h-full flex-col gap-2 py-5">
                    <CartItems />
                    <Checkout />
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default Cart
