"use client"

import type { AnchorHTMLAttributes, FC, ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ClassValue } from "class-variance-authority/types"

import { cn } from "@/lib/utils"

interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string
    className?: string
    activeClass?: ClassValue
    children?: ReactNode
}

const NavLink: FC<NavLinkProps> = ({
    href,
    className,
    activeClass,
    children,
    ...props
}) => {
    const pathname = usePathname()
    const isActive = pathname === href
    if (isActive) className = cn(className, activeClass)

    return (
        <Link href={href} className={className} {...props}>
            {children}
        </Link>
    )
}

export default NavLink
