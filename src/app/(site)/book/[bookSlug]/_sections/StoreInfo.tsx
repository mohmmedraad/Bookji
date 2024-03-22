import { type FC } from "react"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { books as booksTable } from "@/db/schema"
import { and, eq } from "drizzle-orm"

import { UserAvatar } from "@/components/UserAvatar"

interface UserInfoProps {
    storeId: number
}

async function getStoreInfo(storeId: number) {
    const store = await db.query.stores.findFirst({
        columns: {
            id: true,
            name: true,
            logo: true,
        },
        where: and(eq(booksTable.id, storeId), eq(booksTable.isDeleted, false)),
    })

    return store
}

const StoreInfo: FC<UserInfoProps> = async ({ storeId }) => {
    const store = await getStoreInfo(storeId)

    if (!store) {
        return notFound()
    }

    return (
        <div className="flex gap-4">
            <UserAvatar
                className="h-12 w-12 shadow-md"
                user={{
                    firstName: store.name || null,
                    lastName: null,
                    imageUrl: store.logo || "",
                }}
            />

            <p className="text-sm font-bold">{store.name}</p>
        </div>
    )
}

export default StoreInfo
