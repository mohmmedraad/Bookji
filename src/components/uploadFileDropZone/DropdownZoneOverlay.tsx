"use client"

import { type FC } from "react"
import { CircularProgress } from "@nextui-org/react"

import { useFileUploadStore } from "@/hooks/useFileUploadStore"

interface DropdownZoneOverlayProps {}

const DropdownZoneOverlay: FC<DropdownZoneOverlayProps> = ({}) => {
    const { uploadingProgress, isFileUploading, isError } = useFileUploadStore()

    if (isError || !isFileUploading || uploadingProgress >= 100) return null

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <CircularProgress
                aria-label="uploading..."
                size="md"
                value={uploadingProgress}
                color="success"
                showValueLabel={true}
                maxValue={100}
            />
        </div>
    )
}

export default DropdownZoneOverlay
