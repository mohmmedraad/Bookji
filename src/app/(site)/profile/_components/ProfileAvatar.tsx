"use client"

import { type FC } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"

import { useUserInfo } from "@/hooks/useUserInfo"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card"
import { UserAvatar } from "@/components/UserAvatar"

import ChangeAvatarButton from "./ChangeAvatarButton"

interface ProfileAvatarProps {
    imageUrl: string
    firstName: string | null
    lastName: string | null
}

const ProfileAvatar: FC<ProfileAvatarProps> = ({
    imageUrl,
    firstName,
    lastName,
}) => {
    const user = useUserInfo()
    return (
        <Card>
            <CardContent className="flex gap-6">
                <UserAvatar
                    user={{
                        firstName: user.firstName || firstName,
                        lastName: user.lastName || lastName,
                        imageUrl: imageUrl,
                    }}
                    className="mt-6 h-20 w-20 rounded-md shadow-md"
                />
                <CardHeader>
                    <CardTitle>
                        {user.firstName ?? firstName}{" "}
                        {user.lastName ?? lastName}
                    </CardTitle>
                    <ChangeAvatarButton />
                </CardHeader>
            </CardContent>
        </Card>
    )
}

export default ProfileAvatar
