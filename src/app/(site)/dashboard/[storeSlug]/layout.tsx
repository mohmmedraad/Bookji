import React from "react"
import { notFound, redirect } from "next/navigation"
import { db } from "@/db"
import { currentUser } from "@clerk/nextjs"
import { and } from "drizzle-orm"

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

const Layout = async ({
    params: { storeSlug },
    children,
}: { children: React.ReactNode } & pageParams) => {
    const user = await currentUser()

    if (!user || !user.id) {
        return redirect(`/sing-in?origin=/dashboard/${storeSlug}`)
    }
    const store = await db.query.stores.findFirst({
        where: (store, { eq }) =>
            and(eq(store.slug, storeSlug), eq(store.ownerId, user.id)),
    })

    if (!store) {
        return notFound()
    }

    return (
        <>
            <StoreProvider {...store} />
            <PageHeading>Book Store</PageHeading>
            {/* <nav className="py-8">
                <ul className="flex gap-1">
                    {storeLinks.map(({ href, label }, index) => (
                        <NavLink
                            key={index}
                            href={href.replace("(storeId)", storeId)}
                            className="rounded-md px-3 py-2 font-semibold text-[#182230]"
                            activeClass="bg-gray-100"
                        >
                            {label}
                        </NavLink>
                    ))}
                </ul>
            </nav> */}
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
