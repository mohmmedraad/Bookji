"use client"

import type { AnchorHTMLAttributes, FC, ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ClassValue } from "class-variance-authority/types"

import { cn } from "@/lib/utils"

interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string
    activeClass?: ClassValue
    hoverClass?: ReactNode
}

const NavLink: FC<NavLinkProps> = ({
    href,
    className,
    activeClass,
    children,
    hoverClass,
    ...props
}) => {
    const pathname = usePathname()
    const isActive = href === "/" ? pathname === href : pathname.includes(href)
    if (isActive) className = cn(className, activeClass)

    return (
        <Link
            href={href}
            className={cn(className, !isActive && hoverClass)}
            {...props}
        >
            {children}
        </Link>
    )
}

export default NavLink
