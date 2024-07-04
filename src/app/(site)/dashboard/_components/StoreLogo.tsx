"use client"

import Image from "next/image"
import type { User } from "@clerk/nextjs/server"
import { type AvatarProps } from "@radix-ui/react-avatar"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface StoreLogoProps extends AvatarProps {
    logo: string
    name: string
}

export const StoreLogo = ({ logo, name, ...props }: StoreLogoProps) => {
    return (
        <Avatar {...props}>
            {logo ? (
                <div className="relative aspect-square h-full w-full">
                    <Image
                        fill
                        src={logo}
                        alt={`${name} logo`}
                        referrerPolicy="no-referrer"
                        loading="eager"
                    />
                </div>
            ) : (
                <AvatarFallback>
                    <span className="sr-only">{name}</span>
                </AvatarFallback>
            )}
        </Avatar>
    )
}
