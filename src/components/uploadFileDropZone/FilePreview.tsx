"use client"

import { useState, type FC, type HTMLAttributes } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { useFileUploadStore } from "@/hooks/useFileUploadStore"

interface FilePreviewProps extends HTMLAttributes<HTMLImageElement> {}

const FilePreview: FC<FilePreviewProps> = ({ className }) => {
    const { file, fileUrl, isError } = useFileUploadStore()
    const [imgSrc, setImgSrc] = useState<string | ArrayBuffer | null>("")

    if (isError || (!file && !fileUrl)) return null

    if (file && !imgSrc) {
        const reader = new FileReader()
        reader.onloadend = () => {
            setImgSrc(reader.result)
        }
        reader.readAsDataURL(file)
    }

    return (
        <Image
            // @ts-expect-error cover is a string
            src={imgSrc || fileUrl}
            alt={""}
            fill
            className={cn("h-full w-full object-cover", className)}
        />
    )
}

export default FilePreview
