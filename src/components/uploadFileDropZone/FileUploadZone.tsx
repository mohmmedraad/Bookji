"use client"

import { type FC } from "react"
import { type Endpoint } from "@/types"
import { type BlobSchema } from "valibot"

import { UploadFileProvider } from "./UploadFileProvider"
import UploadingZone from "./UploadingZone"

interface FileUploadZoneProps {
    className?: string
    schema: BlobSchema<Blob>
    endpoint: Endpoint
    uploadContent: React.ReactNode
    onChange?: (url: string) => void
}

const FileUploadZone: FC<FileUploadZoneProps> = ({
    className,
    schema,
    endpoint,
    uploadContent,
    onChange,
}) => {
    return (
        <UploadFileProvider
            initialValues={{ schema, endpoint, onChange, uploadContent }}
        >
            <UploadingZone className={className} />
        </UploadFileProvider>
    )
}

export default FileUploadZone
