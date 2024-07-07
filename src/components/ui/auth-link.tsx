"use client"

import { type FC, type HTMLAttributes, type ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface AuthLinkProps extends HTMLAttributes<HTMLAnchorElement> {
    children?: ReactNode
    href: string
}

const AuthLink: FC<AuthLinkProps> = ({ children, className, href }) => {
    const pathName = usePathname()
    pathName
    return (
        <Link href={`${href}?_origin=${pathName}`} className={className}>
            {children}
        </Link>
    )
}

export default AuthLink
