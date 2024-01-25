"use client"

import { type FC } from "react"
import Image from "next/image"
import { Camera, Pencil, Share2 } from "lucide-react"

import { useStore } from "@/hooks/useStore"
import { Button } from "@/components/ui/Button"

import UpdateLogoButton from "../_components/UpdateLogoButton"
import UpdateThumbnailButton from "../_components/UpdateThumbnailButton"

interface StoreInfoProps {
    logo: string | null
    thumbnail: string | null
}

const StoreInfo: FC<StoreInfoProps> = ({ logo, thumbnail }) => {
    const storeLogo = useStore((state) => state.logo)
    const storeThumbnail = useStore((state) => state.thumbnail)
    return (
        <>
            <div className="relative shadow-md">
                <Image
                    loading="eager"
                    priority
                    src={storeThumbnail || thumbnail || "placeholder"}
                    alt={`thumbnail`}
                    className="h-36 w-full rounded-[1.25rem] object-cover lg:h-60"
                    width={1200}
                    height={240}
                />
                <UpdateThumbnailButton />
                <div className=" absolute bottom-0 left-3 translate-y-[50%]">
                    <Image
                        loading="eager"
                        src={storeLogo || logo || "placeholder"}
                        alt={`logo`}
                        className="aspect-square w-20 rounded-full border-2 border-white object-cover lg:w-40"
                        width={160}
                        height={160}
                    />
                    <UpdateLogoButton />
                </div>
            </div>
            <div
                className="mt-6 flex justify-end
pr-3"
            >
                <Button>
                    <Share2 className="text-xl" width={20} height={20} />
                    <span className="ml-2 hidden font-medium text-white md:block">
                        Share
                    </span>
                </Button>
            </div>
        </>
    )
}

export default StoreInfo
