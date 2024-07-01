import { useEffect, type FC } from "react"
import { type Endpoint } from "@/types"
import { type BlobSchema } from "valibot"

import { cn } from "@/lib/utils"
import { useUploadFile } from "@/hooks/use-upload-file"

import DropFileZone from "./drop-file-zone"
import DropdownZoneOverlay from "./dropdown-zone-overlay"
import FilePreview from "./file-preview"

interface UploadingZoneProps {
    className?: string
    schema?: BlobSchema<Blob>
    endpoint?: Endpoint
    uploadContent?: React.ReactNode
    onChange?: (fileUrl: string) => void
}

const UploadingZone: FC<UploadingZoneProps> = ({
    schema,
    endpoint,
    uploadContent,
    className,
    onChange,
    ...props
}) => {
    const {
        file,
        fileUrl,
        uploadingProgress,
        isSuccess,
        isFileUploading,
        isError,
        error,
        setFile,
    } = useUploadFile({ schema, endpoint })

    useEffect(() => {
        if (fileUrl && onChange) {
            onChange(fileUrl)
        }
    }, [fileUrl, onChange])

    return (
        <div className="flex w-full flex-col items-center justify-center">
            <div
                className={cn("relative overflow-hidden", className)}
                {...props}
            >
                {!isFileUploading ? (
                    <DropFileZone
                        uploadContent={uploadContent}
                        onChange={(file) => {
                            console.log(file)
                            setFile(file)
                        }}
                    />
                ) : null}
                {!isError && isFileUploading && !isSuccess ? (
                    <DropdownZoneOverlay
                        uploadingProgress={uploadingProgress}
                    />
                ) : null}
                {!isError && file ? <FilePreview file={file} /> : null}
            </div>
            {isError ? (
                <p className="mt-2 text-[0.8rem] font-medium text-destructive">
                    {error}
                </p>
            ) : null}
        </div>
    )
}

export default UploadingZone
