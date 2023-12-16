"use client"

import { useEffect, useState, type FC, type HTMLAttributes } from "react"
import { parse, ValiError } from "valibot"

import { uploadFiles } from "@/lib/uploadthing"
import { bookCoverSchema } from "@/lib/validations/book"

import DropdownZone from "./DropdownZone"

interface AddBookInputProps {
    onChange?: (coverUrl: string) => void
}

const AddBookInput: FC<AddBookInputProps> = ({ onChange }) => {
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [uploadProgress, setUploadProgress] = useState<number>(0)
    const [coverUrl, setCoverUrl] = useState<string>("")

    useEffect(() => {
        if (onChange) {
            onChange(coverUrl)
        }
    }, [onChange, coverUrl])

    async function handleOnFileChange(cover: File | null) {
        /**
         * TODO: return error if file is null
         */
        if (!cover) return
        try {
            setErrorMessage("")
            setUploadProgress(0)
            parse(bookCoverSchema, cover)
            const uploadedCover = await uploadCover(cover)
            setCoverUrl(uploadedCover[0].url)
        } catch (error) {
            handleCoverError(error)
        }
    }

    async function uploadCover(cover: File) {
        const uploadedFile = await uploadFiles({
            endpoint: "bookCoverUploader",
            files: [cover],
            onUploadProgress({ progress }) {
                setUploadProgress(progress)
            },
        })
        return uploadedFile
    }

    function handleCoverError(error: unknown) {
        setCoverUrl("")
        if (error instanceof ValiError) {
            return setErrorMessage(error.message)
        }
        /**
         * TODO: Handle uploadthing errors
         */
        return setErrorMessage("Something went wrong while uploading the file")
    }

    return (
        <>
            <DropdownZone
                uploadProgress={uploadProgress}
                isError={!!errorMessage}
                errorMessage={errorMessage}
                onFile={(cover) => void handleOnFileChange(cover)}
                className="aspect-[2/3] max-w-[176px]"
            />
        </>
    )
}

export default AddBookInput
