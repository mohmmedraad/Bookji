import type { FC } from "react"
import Image from "next/image"
import { Camera, PencilLine, Share2 } from "lucide-react"

import { Button } from "@/components/ui/Button"
import Container from "@/components/ui/Container"
import ProfileContainer from "@/components/ui/ProfileContainer"
import { Separator } from "@/components/ui/Separator"

interface ProfileInfoProps {
    userName: string
    firstName: string | null
    lastName: string | null
    avatarUrl: string
    thumbnailUrl: string | undefined
    title: string | undefined
    bio: string | undefined
}

const ProfileInfo: FC<ProfileInfoProps> = ({
    firstName,
    lastName,
    avatarUrl,
    thumbnailUrl,
    title,
    bio,
}) => {
    return (
        <div className="pt-20">
            <Container>
                <div className="relative">
                    <Image
                        loading="eager"
                        src={thumbnailUrl || "/default-thumbnail.png"}
                        alt={`${firstName} thumbnail`}
                        className="h-36 w-full rounded-[1.25rem] lg:h-60"
                        width={1200}
                        height={240}
                    />
                    <Button className="absolute  bottom-3 right-3  flex gap-2 bg-black/40 text-xs text-white hover:bg-black/20 md:bottom-6 md:right-6 md:text-sm">
                        <Camera className="text-base" width={16} height={16} />
                        Edit
                    </Button>
                    <div className=" absolute bottom-0 left-3  h-20 w-20 translate-y-[50%] overflow-hidden rounded-full border-2 border-white lg:left-6 lg:h-40 lg:w-40">
                        <Image
                            loading="eager"
                            src={avatarUrl}
                            alt={`${firstName} avatar`}
                            className="w-full"
                            width={160}
                            height={160}
                        />
                    </div>
                </div>
                <ProfileContainer>
                    <div className="flex flex-wrap justify-between gap-3">
                        <div className="grid gap-2">
                            <h2 className="text-xl font-semibold">{`${firstName} ${lastName}`}</h2>
                            <p className="text-sm text-gray-700">
                                {title || "New user"}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant={"outline"}>
                                <PencilLine
                                    className="text-xl text-gray-800"
                                    width={20}
                                    height={20}
                                />
                                <span className="ml-2 hidden font-medium md:block">
                                    Edit
                                </span>
                            </Button>
                            <Button>
                                <Share2
                                    className="text-xl"
                                    width={20}
                                    height={20}
                                />
                                <span className="ml-2 hidden font-medium text-white md:block">
                                    Share
                                </span>
                            </Button>
                        </div>
                    </div>
                    <h3 className="mt-8 md:text-xl">About Me</h3>
                    <p className="text-xs text-gray-800 md:text-sm">{bio}</p>
                    <Separator className="my-8" />
                </ProfileContainer>
            </Container>
        </div>
    )
}

export default ProfileInfo
