"use client"

import { type FC } from "react"

import useCart from "@/hooks/useCart"

import CartItem from "./CartItem"

interface CartItemsProps {}

const CartItems: FC<CartItemsProps> = ({}) => {
    const cartBooks = useCart((state) => state.cartBooks)

    return (
        <>
            {cartBooks.length === 0 ? (
                <div>The cart is empty</div>
            ) : (
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
            )}
        </>
    )
}

export default CartItems
