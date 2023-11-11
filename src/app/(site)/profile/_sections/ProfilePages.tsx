import type { FC } from "react"

import Container from "@/components/ui/Container"
import NavLink from "@/components/ui/NavLink"
import ProfileContainer from "@/components/ui/ProfileContainer"

interface ProfilePagesProps {}

const pagesLinks = [
    { name: "My books", href: "/profile" },
    { name: "Purchases", href: "/profile/purchases" },
    { name: "Orders", href: "/profile/orders" },
]

const ProfilePagesLinks: FC<ProfilePagesProps> = ({}) => {
    return (
        <div className="mb-4 flex gap-6 border-b-[1px] border-solid border-border pb-2">
            {pagesLinks.map(({ name, href }) => (
                <NavLink
                    key={name}
                    href={href}
                    activeClass="font-bold relative after:w-full after:h-[1px] after:bottom-[-9px] after:left-0 after:bg-black after:absolute"
                >
                    {name}
                </NavLink>
            ))}
        </div>
    )
}

export default ProfilePagesLinks
