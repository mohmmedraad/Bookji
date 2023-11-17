import { type FC } from "react"
import Link from "next/link"
import { currentUser } from "@clerk/nextjs"
import type { EmailAddress } from "@clerk/nextjs/server"

import { navLinks } from "@/config/site"

import { Icons } from "./Icons"
import MobileNav from "./MobileNav"
import { buttonVariants } from "./ui/Button"
import Container from "./ui/Container"
import NavLink from "./ui/NavLink"
import { UserAccountNav } from "./UserAccountNav"

function getUserPrimaryEmailAddress(
    emailAddresses: EmailAddress[],
    primaryEmailAddressId: string | null
) {
    return emailAddresses.find((email) => email.id === primaryEmailAddressId)
        ?.emailAddress
}

const NavBar: FC = async ({}) => {
    const user = await currentUser()
    let primaryEmailAddress: string | undefined

    if (user != null) {
        primaryEmailAddress = getUserPrimaryEmailAddress(
            user.emailAddresses,
            user.primaryEmailAddressId
        )
    }
    return (
        <header className="fixed left-0 top-0 z-40 w-full bg-gradient-nav">
            <Container className=" flex h-14 items-center justify-between">
                <Link href="/">
                    <div className="flex items-center justify-between lg:flex">
                        <Icons.Logo width="40" height="40" />
                        <span className="hidden lg:ml-2 lg:inline lg:text-2xl lg:font-bold">
                            BOOK STORE
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
                <div className="flex items-center justify-center gap-3 ">
                    <div className="relative flex rounded-full bg-primary p-2.5">
                        <Icons.Cart width="16px" height="16px" />
                        <div className="absolute -right-2 -top-2 inline-flex h-6 w-6 items-center rounded-full border border-transparent bg-secondary p-2 text-xs font-semibold text-gray-900 transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                            10
                        </div>
                    </div>
                    {user != null ? (
                        <UserAccountNav
                            user={{
                                firstName: user.firstName,
                                lastName: user.lastName,
                                imageUrl: user.imageUrl,
                                primaryEmailAddress,
                            }}
                        />
                    ) : (
                        <Link className={buttonVariants({})} href={"/sign-in"}>
                            Sign In
                        </Link>
                    )}
                    <MobileNav />
                </div>
            </Container>
        </header>
    )
}

export default NavBar
