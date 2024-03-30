import React from "react"
import { type Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { site } from "@/config/site"
import { title } from "@/lib/utils"
import { getCachedStore, getCachedUser } from "@/lib/utils/cachedResources"
import { Separator } from "@/components/ui/Separator"

import DashboardNav from "../_components/DashboardNav"
import PageHeading from "../_components/PageHeading"
import StoreProvider from "./_components/StoreProvider"

const storeLinks = [
    {
        href: "/dashboard/(storeSlug)",
        label: "Store",
    },
    {
        href: "/dashboard/(storeSlug)/books",
        label: "Books",
    },
    {
        href: "/dashboard/(storeSlug)/orders",
        label: "Orders",
    },
    {
        href: "/dashboard/(storeSlug)/customers",
        label: "Customers",
    },
    {
        href: "/dashboard/(storeSlug)/analytics",
        label: "Analytics",
    },
]

type pageParams = {
    params: {
        storeSlug: string
    }
}

export const generateMetadata = async ({
    params: { storeSlug },
}: pageParams): Promise<Metadata | undefined> => {
    const user = await getCachedUser()

    if (!user || !user.id) {
        return
    }

    const store = await getCachedStore(storeSlug, user.id)

    if (!store) {
        return
    }

    return {
        title: {
            default: `${title(store.name)}`,
            template: `%s - ${title(store.name)}`,
        },
        description:
            "manage your own book store on Bookji. Showcase your collection, manage orders, and engage with customers.",
        icons: { icon: store.logo || `${site.url}/icon.png` },
    }
}

const Layout = async ({
    params: { storeSlug },
    children,
}: { children: React.ReactNode } & pageParams) => {
    const user = await getCachedUser()

    if (!user || !user.id) {
        return redirect(`/sing-in?origin=/dashboard/${storeSlug}`)
    }

    const store = await getCachedStore(storeSlug, user.id)

    if (!store) {
        return notFound()
    }

    return (
        <>
            <StoreProvider {...store} />
            <PageHeading>Book Store</PageHeading>
            <DashboardNav
                links={storeLinks}
                hrefFunction={(href) => href.replace("(storeSlug)", storeSlug)}
                className="pt-6"
            />
            <Separator className="mb-8" />
            {children}
        </>
    )
}

export default Layout
