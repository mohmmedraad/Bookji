"use client"

import { useState, type FC, type HTMLAttributes } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { FileError } from "@/lib/utils/fileUploading"

interface FilePreviewProps extends HTMLAttributes<HTMLImageElement> {
    file: File | null
}

const FilePreview: FC<FilePreviewProps> = ({ file, className }) => {
    const [imgSrc, setImgSrc] = useState<string | ArrayBuffer | null>("")

    if (!file) {
        throw new FileError("No file to upload, please select a file")
    }

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
            src={imgSrc}
            alt={""}
            fill
            className={cn("h-full w-full object-cover", className)}
        />
    )
}

export default FilePreview
