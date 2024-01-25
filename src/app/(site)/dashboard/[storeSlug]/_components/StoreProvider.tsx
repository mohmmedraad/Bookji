"use client"

import { useEffect, type FC } from "react"
import { type Store } from "@/db/schema"

import { useStore } from "@/hooks/useStore"

type StoreProviderProps = Store

const StoreProvider: FC<StoreProviderProps> = (store) => {
    const { id, name, description, logo, thumbnail, slug } = store
    const setStore = useStore((state) => state.setStore)

    useEffect(() => {
        setStore({ id, name, description, logo, thumbnail, slug })
    }, [description, id, logo, name, setStore, slug, thumbnail])

    return null
}

export default StoreProvider
