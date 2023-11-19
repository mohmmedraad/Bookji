"use client"

import { useState, type FC, type HTMLAttributes } from "react"
import { parse, ValiError } from "valibot"

import { uploadFiles } from "@/lib/uploadthing"
import { bookCoverSchema } from "@/lib/validations/book"

import DropdownZone from "./DropdownZone"

interface AddBookInputProps extends HTMLAttributes<HTMLDivElement> {
    onCoverUploaded: (fileKey: string | null) => void
}

const AddBookInput: FC<AddBookInputProps> = ({ onCoverUploaded }) => {
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [uploadProgress, setUploadProgress] = useState<number>(0)

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
            onCoverUploaded(uploadedCover[0].url)
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
        onCoverUploaded(null)
        console.log(error instanceof ValiError)
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
