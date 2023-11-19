import { useState, type ChangeEvent, type FC, type HTMLAttributes } from "react"
import { Upload } from "lucide-react"

import DropdownZonePreview from "./DropdownZonePreview"
import { Label } from "./ui/Label"

interface DropdownZoneProps extends HTMLAttributes<HTMLDivElement> {
    uploadProgress: number
    isError: boolean
    errorMessage: string
    onFile: (file: File | null) => void
}

const DropdownZone: FC<DropdownZoneProps> = ({
    uploadProgress,
    isError,
    errorMessage,
    onFile,
    className,
    ...props
}) => {
    const [cover, setCover] = useState<string | ArrayBuffer | null>(null)

    function handleOnFileChange(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return
        const file = e.target.files[0]
        onFile(file)
        const reader = new FileReader()
        reader.onloadend = () => {
            setCover(reader.result)
        }
        reader.readAsDataURL(file)
    }

    function handleRemoveCover() {
        setCover(null)
        onFile(null)
    }

    return (
        <>
            {cover && !isError ? (
                <DropdownZonePreview
                    cover={cover}
                    uploadProgress={uploadProgress}
                    handleRemoveFile={handleRemoveCover}
                    className="w-[176px]"
                />
            ) : (
                <div className={className} {...props}>
                    <Label htmlFor="cover" className="block h-full w-full">
                        <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 rounded-md border-[1px] border-dashed border-primary bg-primary/10 p-6">
                            <div className="flex items-center justify-center rounded-full border-[1px] border-solid border-gray-100 bg-background p-3">
                                <Upload className="h-4 w-4 text-primary" />
                            </div>
                            <p className="text-center text-xs text-gray-800">
                                <span className="text-primary">
                                    Click to upload
                                </span>{" "}
                                or drag and drop PNG, JPG, and max image size
                                (1MB)
                            </p>
                            <input
                                name="cover"
                                id="cover"
                                type="file"
                                className="absolute inset-0 opacity-0"
                                accept=".jpg, .jpeg, .png, .webp"
                                onChange={handleOnFileChange}
                            />
                        </div>
                    </Label>
                    {isError ? (
                        <p className="mt-2 text-[0.8rem] font-medium text-destructive">
                            {errorMessage}
                        </p>
                    ) : null}
                </div>
            )}
        </>
    )
}

export default DropdownZone
