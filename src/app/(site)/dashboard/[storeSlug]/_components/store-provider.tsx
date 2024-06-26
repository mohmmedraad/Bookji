"use client"

import { useEffect, type FC } from "react"
import { type Store } from "@/db/schema"
import { useStore } from "@/store/use-store"

type StoreProviderProps = Omit<
    Store,
    "isDeleted" | "deletedAt" | "createdAt" | "stripeAccountId" | "updatedAt"
>

const StoreProvider: FC<StoreProviderProps> = (store) => {
    const { id, name, description, logo, thumbnail, slug, active } = store
    const setStore = useStore((state) => state.setStore)

    useEffect(() => {
        setStore({ id, name, description, logo, thumbnail, slug, active })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [description, id, logo, name, setStore, slug, thumbnail])

    return null
}

export default StoreProvider
