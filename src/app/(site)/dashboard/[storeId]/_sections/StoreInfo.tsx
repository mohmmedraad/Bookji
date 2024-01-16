import { type FC } from "react"
import Image from "next/image"
import { Camera, Pencil, Share2 } from "lucide-react"

import { Button } from "@/components/ui/Button"

interface StoreInfoProps {}

const StoreInfo: FC<StoreInfoProps> = ({}) => {
    return (
        <>
            <div className="relative">
                <Image
                    loading="eager"
                    src={"/default-thumbnail.png"}
                    alt={`thumbnail`}
                    className="h-36 w-full rounded-[1.25rem] lg:h-60"
                    width={1200}
                    height={240}
                />
                <Button className="absolute  bottom-3 right-3  flex gap-2 bg-black/40 text-xs text-white hover:bg-black/20 md:bottom-6 md:right-6 md:text-sm">
                    <Camera className="text-base" width={16} height={16} />
                    Edit
                </Button>
                <div className=" absolute bottom-0 left-3 translate-y-[50%]">
                    <Image
                        loading="eager"
                        src={"/person-1.webp"}
                        alt={`avatar`}
                        className="aspect-square w-20 rounded-full border-2 border-white lg:w-40"
                        width={160}
                        height={160}
                    />
                    <Button className="absolute bottom-[15%] right-1/4 h-fit translate-x-1/2 translate-y-1/2 rounded-full p-3">
                        <Pencil
                            className="aspect-square text-white"
                            width={16}
                            height={16}
                        />
                    </Button>
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
