import { type FC } from "react"
import Link from "next/link"
import type { EmailAddress } from "@clerk/nextjs/server"

import { navLinks } from "@/config/site"
import { getCachedUser } from "@/lib/utils/cachedResources"

import Cart from "./Cart"
import { Icons } from "./Icons"
import MobileNav from "./MobileNav"
import AuthLink from "./ui/AuthLink"
import { buttonVariants } from "./ui/button"
import Container from "./ui/Container"
import NavLink from "./ui/NavLink"
import { Separator } from "./ui/Separator"
import { UserAccountNav } from "./UserAccountNav"

function getUserPrimaryEmailAddress(
    emailAddresses: EmailAddress[],
    primaryEmailAddressId: string | null
) {
    return emailAddresses.find((email) => email.id === primaryEmailAddressId)
        ?.emailAddress
}

const NavBar: FC = async ({}) => {
    const user = await getCachedUser()

    let primaryEmailAddress: string | undefined

    if (user != null) {
        primaryEmailAddress = getUserPrimaryEmailAddress(
            user.emailAddresses,
            user.primaryEmailAddressId
        )
    }
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
                        {user != null ? (
                            /**
                             * TODO: Add suspense
                             */
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
                        ) : (
                            <AuthLink
                                className={buttonVariants({})}
                                href={"/sign-in"}
                            >
                                Sign In
                            </AuthLink>
                        )}

                        <MobileNav />
                    </div>
                </div>
                <Separator className="mt-4" />
            </Container>
        </header>
    )
}

export default NavBar
