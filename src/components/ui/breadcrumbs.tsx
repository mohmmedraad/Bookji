"use client"

import React, { type FC } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

import { cn } from "@/lib/utils"

interface BreadcrumbsItemProps {
    pathNames: string[]
    path: string
    isLast: boolean
}

const BreadcrumbsItem: FC<BreadcrumbsItemProps> = ({
    pathNames,
    path,
    isLast,
}) => (
    <li className="flex items-center gap-2">
        <Link
            href={`/${pathNames
                .slice(0, pathNames.indexOf(path) + 1)
                .join("/")}`}
            className={cn(
                "flex items-center gap-2 underline-offset-4 hover:underline",
                isLast && "text-gray-500"
            )}
        >
            {path}
        </Link>
        {isLast ? null : <ChevronRight className="h-3 w-3 text-gray-400" />}
    </li>
)

const Breadcrumbs: FC = () => {
    const pathNames = usePathname().split("/").slice(1)
    return (
        <nav>
            <ol className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-700">
                <li className="flex items-center gap-2">
                    <Link
                        href={"/"}
                        className={
                            "flex items-center gap-2 underline-offset-4 hover:underline"
                        }
                    >
                        <Home className="h-3 w-3" />
                        Home
                    </Link>
                    <ChevronRight className="h-3 w-3 text-gray-400" />
                </li>
                {pathNames.map((path, index) => (
                    <BreadcrumbsItem
                        key={index}
                        pathNames={pathNames}
                        path={path}
                        isLast={index === pathNames.length - 1}
                    />
                ))}
            </ol>
        </nav>
    )
}

export default Breadcrumbs
