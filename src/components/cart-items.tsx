"use client"

import { type FC } from "react"
import Link from "next/link"
import useCart from "@/store/use-cart"

import { ScrollArea } from "@/components/ui/scroll-area"
import CartItem from "@/components/cart-item"

interface CartItemsProps {}

const CartItems: FC<CartItemsProps> = ({}) => {
    const cartBooks = useCart((state) => state.cartBooks)

    return (
        <>
            {cartBooks.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 ">
                    <p className="text-center text-xl text-gray-500">
                        Your Cart is Empty
                    </p>
                    <Link href="/shop">Start Purchasing</Link>
                </div>
            ) : (
                <ScrollArea className="h-full">
                    <div className="grid gap-8">
                        {cartBooks.map((book) => (
                            <CartItem
                                key={book.bookId}
                                bookId={book.bookId}
                                title={book.title || ""}
                                price={+book.price! || 0}
                                quantity={book.quantity}
                                coverImage={book.cover || ""}
                            />
                        ))}
                    </div>
                </ScrollArea>
            )}
        </>
    )
}

export default CartItems
