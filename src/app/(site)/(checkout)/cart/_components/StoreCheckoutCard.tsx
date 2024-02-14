"use client"

import { type FC } from "react"
import Image from "next/image"

import useCart from "@/hooks/useCart"
import BookWrapper from "@/components/ui/BookWrapper"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card"
import { ScrollArea } from "@/components/ui/ScrollArea"
import { Skeleton } from "@/components/ui/Skeleton"
import CartItem from "@/components/CartItem"
import { trpc } from "@/app/_trpc/client"

import StoreCheckoutButton from "./StoreCheckoutButton"

interface StoreCheckoutCardProps {
    storeId: number
}

const StoreCheckoutCard: FC<StoreCheckoutCardProps> = ({ storeId }) => {
    const cartBooks = useCart((state) => state.cartBooks)
    const isCartLoading = useCart((state) => state.isLoading)

    const { data: storeInfo } = trpc.store.getStoreInfo.useQuery({
        storeId,
    })

    const books = cartBooks.filter((book) => book.storeId === storeId)

    if (!isCartLoading && books.length === 0) return null

    return (
        <Card>
            <CardHeader className="overflow-hidden px-0 pt-0">
                <CardTitle className="flex items-center gap-4 rounded-t-xl rounded-tr-2xl border-b-1 border-solid border-gray-100 bg-gray-50 px-6 py-2">
                    <Image
                        loading="eager"
                        src={storeInfo?.logo || "/placeholder.png"}
                        alt={`${storeInfo?.logo ?? "store"} logo`}
                        className="aspect-square w-10 rounded-full border-2 object-cover"
                        width={160}
                        height={160}
                    />
                    {storeInfo?.name}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-96">
                    {isCartLoading ? (
                        <div className="grid gap-8">
                            {new Array(3).fill(0).map((_, i) => (
                                <div key={i} className="flex gap-3">
                                    <BookWrapper className="h-[112px] w-[80px]">
                                        <Skeleton className="h-full w-full" />
                                    </BookWrapper>

                                    <Skeleton className="h-3 w-24" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid gap-8">
                            {books?.map(
                                ({ bookId, cover, title, price, quantity }) => (
                                    <CartItem
                                        key={bookId}
                                        bookId={bookId}
                                        title={title!}
                                        coverImage={cover!}
                                        price={+price!}
                                        quantity={quantity}
                                    />
                                )
                            )}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
            <CardFooter>
                <StoreCheckoutButton storeId={storeId} items={books} />
            </CardFooter>
        </Card>
    )
}

export default StoreCheckoutCard
