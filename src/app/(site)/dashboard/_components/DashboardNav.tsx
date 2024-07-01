import { type FC } from "react"

import { cn } from "@/lib/utils"
import NavLink from "@/components/ui/nav-link"

type Link = {
    href: string
    label: string
}
interface DashboardNavProps extends React.HTMLAttributes<HTMLElement> {
    links: Link[]
    hrefFunction?: (href: string) => string
}

const DashboardNav: FC<DashboardNavProps> = ({
    links,
    hrefFunction,
    className,
}) => {
    return (
        <nav className={cn("overflow-x-auto pb-4 pt-8", className)}>
            <ul className="flex gap-1">
                {links.map(({ href, label }, index) => (
                    <NavLink
                        key={index}
                        href={hrefFunction ? hrefFunction(href) : href}
                        className="rounded-md px-3 py-2 font-semibold text-[#182230]"
                        activeClass="bg-gray-100"
                        hoverClass="hover:bg-gray-50"
                    >
                        {label}
                    </NavLink>
                ))}
            </ul>
        </nav>
    )
}

export default DashboardNav
