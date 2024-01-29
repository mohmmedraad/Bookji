import { type FC } from "react"
import { clerkClient } from "@clerk/nextjs"

import { UserAvatar } from "@/components/UserAvatar"

interface UserInfoProps {
    userId: string
}

async function getUser(userId: string) {
    const user = await clerkClient.users.getUser(userId)
    return user
}

const UserInfo: FC<UserInfoProps> = async ({ userId }) => {
    const user = await getUser(userId)
    return (
        <div className="flex gap-4">
            <UserAvatar
                className="h-12 w-12 shadow-md"
                user={{
                    firstName: user.firstName || null,
                    lastName: user.lastName || null,
                    imageUrl: user.imageUrl || "",
                }}
            />
            <div>
                <p className="text-sm font-bold">
                    {user.firstName} {user.lastName}
                </p>
                <p className="mt-1 text-xs text-gray-500">University Student</p>
            </div>
        </div>
    )
}

export default UserInfo
