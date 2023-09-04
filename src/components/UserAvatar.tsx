"use client"

import Image from "next/image"
import type { User } from "@clerk/nextjs/server"
import { AvatarProps } from "@radix-ui/react-avatar"

import { Avatar, AvatarFallback } from "@/components/ui/Avatar"

interface UserAvatarProps extends AvatarProps {
    user: Pick<User, "imageUrl" | "firstName" | "lastName">
}

export const UserAvatar = ({ user, ...props }: UserAvatarProps) => {
    return (
        <Avatar {...props}>
            {user.imageUrl ? (
                <div className="relative aspect-square h-full w-full">
                    <Image
                        fill
                        src={user.imageUrl}
                        alt="profile picture"
                        referrerPolicy="no-referrer"
                    />
                </div>
            ) : (
                <AvatarFallback>
                    <span className="sr-only">
                        {user?.firstName + " " + user?.lastName}
                    </span>
                </AvatarFallback>
            )}
        </Avatar>
    )
}
