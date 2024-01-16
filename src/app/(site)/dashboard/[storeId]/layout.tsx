import React from "react"
import { notFound } from "next/navigation"
import { db } from "@/db"

import { Separator } from "@/components/ui/Separator"

import DashboardNav from "../_components/DashboardNav"
import PageHeading from "../_components/PageHeading"

const storeLinks = [
    {
        href: "/dashboard/(storeId)",
        label: "Store",
    },
    {
        href: "/dashboard/(storeId)/books",
        label: "Books",
    },
    {
        href: "/dashboard/(storeId)/orders",
        label: "Orders",
    },
    {
        href: "/dashboard/(storeId)/customers",
        label: "Customers",
    },
    {
        href: "/dashboard/(storeId)/analytics",
        label: "Analytics",
    },
]
type pageParams = {
    params: {
        storeId: string
    }
}

const Layout = ({
    params: { storeId },
    children,
}: { children: React.ReactNode } & pageParams) => {
    // if (isNaN(+storeId)) return notFound()
    // const store = await db.query.stores.findFirst({
    //     where: (store, { eq }) => eq(store.id, parseInt(storeId)),
    // })

    // if (!store) {
    //     return notFound()
    // }

    return (
        <>
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
                hrefFunction={(href) => href.replace("(storeId)", storeId)}
                className="pt-6"
            />
            <Separator className="mb-8" />
            {children}
        </>
    )
}

export default Layout
