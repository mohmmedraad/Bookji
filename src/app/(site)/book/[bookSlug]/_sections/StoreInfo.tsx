import { type FC } from "react"

import { getBook } from "@/lib/utils/cachedResources"
import { UserAvatar } from "@/components/UserAvatar"

interface UserInfoProps {
    bookSlug: string
}

const StoreInfo: FC<UserInfoProps> = async ({ bookSlug }) => {
    const book = await getBook(bookSlug)

    if (!book) {
        return
    }

    return (
        <div className="flex gap-4">
            <UserAvatar
                className="h-12 w-12 shadow-md"
                user={{
                    firstName: book.storeName || null,
                    lastName: null,
                    imageUrl: book.storeLogo || "",
                }}
            />

            <p className="text-sm font-bold">{book.storeName}</p>
        </div>
    )
}

export default StoreInfo
