"use client"

import { type FC } from "react"
import { CircularProgress } from "@nextui-org/react"

interface DropdownZoneOverlayProps {
    uploadingProgress: number
}

const DropdownZoneOverlay: FC<DropdownZoneOverlayProps> = ({
    uploadingProgress,
}) => {
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
