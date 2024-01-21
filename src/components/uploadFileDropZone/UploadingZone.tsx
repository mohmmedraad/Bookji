import { useEffect, type FC, type HTMLAttributes } from "react"

import { uploadFiles } from "@/lib/uploadthing"
import { cn } from "@/lib/utils"
import { useFileUploadStore } from "@/hooks/useFileUploadStore"

import DropdownZone from "./DropdownZone"
import DropdownZoneOverlay from "./DropdownZoneOverlay"
import FilePreview from "./FilePreview"

interface UploadingZoneProps extends HTMLAttributes<HTMLDivElement> {}

const UploadingZone: FC<UploadingZoneProps> = ({ className, ...props }) => {
    const {
        endpoint,
        error,
        isError,
        file,
        onChange,
        setFileUrl,
        setIsFileUploading,
        setUploadingProgress,
        setError,
    } = useFileUploadStore()

    useEffect(() => {
        void handleUploadFile()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file])

    async function handleUploadFile() {
        const isFileNotExist = file === null
        if (isFileNotExist) return
        setIsFileUploading(true)
        setError("")
        try {
            const uploadedFile = await uploadFiles({
                endpoint: endpoint!,
                files: [file],
                onUploadProgress({ progress }) {
                    setUploadingProgress(progress)
                },
            })

            setFileUrl(uploadedFile[0].url)

            if (onChange) {
                onChange(uploadedFile[0].url)
            }
        } catch (error) {
            handleUploadError(error)
        }
    }

    function handleUploadError(_: unknown) {
        console.log("error while uploading file")
        setIsFileUploading(false)
        setError("Something went wrong while uploading the file")
    }
    return (
        <div>
            <div
                className={cn("relative overflow-hidden", className)}
                {...props}
            >
                <DropdownZone />
                <DropdownZoneOverlay />
                <FilePreview />
            </div>
            {isError ? (
                <p className="mt-3 text-[0.8rem] font-medium text-destructive">
                    {error}
                </p>
            ) : null}
        </div>
    )
}

export default UploadingZone
