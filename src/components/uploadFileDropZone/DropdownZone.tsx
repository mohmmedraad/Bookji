"use client"

import { type ChangeEvent, type FC } from "react"
import { parse, ValiError } from "valibot"

import { useFileUploadStore } from "@/hooks/useFileUploadStore"

import { Label } from "../ui/Label"

interface DropdownZoneProps {}

const DropdownZone: FC<DropdownZoneProps> = ({}) => {
    const {
        setFile,
        setError,
        schema,
        isFileUploading,
        fileUrl,
        uploadContent,
        file,
    } = useFileUploadStore()

    function handleOnFileChange(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return
        const file = e.target.files[0]

        try {
            const parsedFile = parse(schema!, file)
            setFile(parsedFile)
        } catch (error) {
            handleFileError(error)
        }
    }

    function handleFileError(error: unknown) {
        if (error instanceof ValiError) {
            return setError(error.message)
        }
    }

    if (file || isFileUploading || fileUrl) {
        return null
    }

    return (
        <Label htmlFor="file" className="block h-full rounded-[inherit]">
            <div className="relative  h-full rounded-[inherit] border-[1px] border-dashed border-primary bg-primary/10 p-6">
                {uploadContent ? uploadContent : null}
                <input
                    name="file"
                    id="file"
                    type="file"
                    className="absolute inset-0 w-full opacity-0"
                    accept=".jpg, .jpeg, .png, .webp"
                    onChange={handleOnFileChange}
                />
            </div>
        </Label>
    )
}

export default DropdownZone
