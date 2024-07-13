"use client"

import { type FC } from "react"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import type { EmailAddress } from "@clerk/nextjs/server"

import { navLinks } from "@/config/site"
import { Skeleton } from "@/components/ui/skeleton"

import Cart from "./Cart"
import { Icons } from "./Icons"
import MobileNav from "./MobileNav"
import AuthLink from "./ui/auth-link"
import { buttonVariants } from "./ui/button"
import Container from "./ui/container"
import NavLink from "./ui/nav-link"
import { Separator } from "./ui/separator"
import { UserAccountNav } from "./UserAccountNav"

function getUserPrimaryEmailAddress(
    emailAddresses: EmailAddress[],
    primaryEmailAddressId: string | null
) {
    return emailAddresses.find((email) => email.id === primaryEmailAddressId)
        ?.emailAddress
}

const NavBar: FC = ({}) => {
    return (
        <header className="fixed left-0 top-0 z-40 w-full bg-background/80 backdrop-blur-sm">
            <Container>
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <div className="flex items-center justify-between lg:flex">
                                <Icons.Logo width="40" height="40" />
                                <span className="hidden lg:ml-2 lg:inline lg:text-2xl lg:font-bold">
                                    BOOKJI
                                </span>
                            </div>
                        </Link>
                        <nav className="hidden md:block">
                            <ul className="flex items-center justify-between gap-6 lg:flex">
                                {navLinks.map(({ name, url }) => (
                                    <li key={name} className="list-none">
                                        <NavLink
                                            href={url}
                                            className="rounded-sm text-sm font-medium before:absolute before:bottom-[-20%] before:h-[3px] before:w-1/2 before:origin-left before:scale-x-0 before:bg-primary before:transition before:duration-150 before:ease-in-out"
                                            activeClass="text-primary relative before:scale-x-100"
                                        >
                                            {name}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                    <div className="flex items-center justify-center gap-3 ">
                        <RenderUser />
                        <MobileNav />
                    </div>
                </div>
                <Separator className="mt-4" />
            </Container>
        </header>
    )
}

function RenderUser() {
    const { user, isLoaded, isSignedIn } = useUser()

    let primaryEmailAddress: string | undefined

    if (user != null) {
        primaryEmailAddress = getUserPrimaryEmailAddress(
            user.emailAddresses as unknown as EmailAddress[],
            user.primaryEmailAddressId
        )
    }

    if (!isLoaded) {
        return (
            <>
                <Skeleton className="h-9 w-10 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-full" />
            </>
        )
    }

    if (!isSignedIn) {
        return (
            <AuthLink className={buttonVariants({})} href={"/sign-in"}>
                Sign In
            </AuthLink>
        )
    }

    return (
        <>
            <Cart />
            <UserAccountNav
                user={{
                    firstName: user.firstName,
                    lastName: user.lastName,
                    imageUrl: user.imageUrl,
                    primaryEmailAddress,
                }}
            />
        </>
    )
}

export default NavBar
