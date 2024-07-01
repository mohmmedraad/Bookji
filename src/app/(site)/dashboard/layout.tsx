import React from "react"
import { type Metadata } from "next"

import { getCachedUser } from "@/lib/utils/cachedResources"
import Breadcrumbs from "@/components/ui/breadcrumbs"
import Container from "@/components/ui/container"
import { Separator } from "@/components/ui/separator"

import DashboardNav from "./_components/DashboardNav"

const dashboardLinks = [
    {
        href: "/dashboard",
        label: "Stores",
    },
    {
        href: "/dashboard/billing",
        label: "Billing",
    },
    {
        href: "/dashboard/purchases",
        label: "Purchases",
    },
]

export const metadata: Metadata = {
    title: {
        default: "Dashboard",
        template: "%s - Dashboard",
    },
    description:
        "Gain insights into your Bookji activities with the personalized dashboard. Track orders, manage billing, and analyze stores performance.",
}

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const user = await getCachedUser()

    if (user == null || user.id == null) return
    return (
        <Container className="min-h-screen pb-8 pt-[104px]">
            <Breadcrumbs />
            {/* <nav className="py-8">
                <ul className="flex gap-1">
                    {dashboardLinks.map(({ href, label }, index) => (
                        <NavLink
                            key={index}
                            href={href}
                            className="rounded-md px-3 py-2 font-semibold text-[#182230]"
                            activeClass="bg-gray-100"
                        >
                            {label}
                        </NavLink>
                    ))}
                </ul>
            </nav> */}
            <DashboardNav links={dashboardLinks} />
            <Separator className="mb-8" />
            {children}
            {/* <ProfileInfo
                userName="mohammed123"
                firstName={user.firstName}
                lastName={user.lastName}
                title={undefined}
                avatarUrl={user.imageUrl}
                thumbnailUrl={undefined}
                bio={bio}
            />
            <Container>
                <ProfileContainer>
                    <ProfilePagesLinks />
                    {children}
                </ProfileContainer>
            </Container> */}
        </Container>
    )
}

export default Layout
