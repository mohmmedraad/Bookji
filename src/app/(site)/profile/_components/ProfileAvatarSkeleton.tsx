import { type FC } from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/Skeleton"

interface ProfileAvatarSkeletonProps {}

const ProfileAvatarSkeleton: FC<ProfileAvatarSkeletonProps> = ({}) => {
    return (
        <Card>
            <CardContent className="flex gap-8 pt-6">
                <Skeleton className="h-20 w-20 rounded-md pt-6" />
                <CardHeader className="pt-0">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-[14px] w-32" />
                </CardHeader>
            </CardContent>
        </Card>
    )
}

export default ProfileAvatarSkeleton
