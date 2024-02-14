import { useEffect, useState } from "react"
import { type Endpoint } from "@/types"
import { parse, ValiError, type BlobSchema } from "valibot"

import { uploadFiles } from "@/lib/uploadthing"
import { FileError } from "@/lib/utils/fileUploading"

interface UseUploadFile {
    schema?: BlobSchema<Blob>
    endpoint?: Endpoint
}

export const useUploadFile = ({ endpoint, schema }: UseUploadFile) => {
    const [file, setFile] = useState<File | null>()
    const [isFileUploading, setIsFileUploading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState("")
    const [isError, setIsError] = useState(false)
    const [fileUrl, setFileUrl] = useState("")
    const [uploadingProgress, setUploadingProgress] = useState(0)

    useEffect(() => {
        if (file) {
            void handleUploadFile()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file])

    async function handleUploadFile() {
        try {
            beforeUpload()

            const uploadedFile = await uploadFiles({
                endpoint: endpoint!,
                files: [file!],
                onUploadProgress({ progress }) {
                    setUploadingProgress(progress)
                },
            })

            handleUploadSuccess(uploadedFile[0].url)
        } catch (error) {
            console.log("upload error", error)
            handleUploadError(error)
        }
    }

    function beforeUpload() {
        if (!schema) {
            throw new Error("No schema provided")
        }

        if (!file) {
            throw new FileError("No file to upload, please select a file")
        }

        setIsFileUploading(true)
        setError("")
        setIsError(false)

        parse(schema, file)
    }

    function handleUploadSuccess(url: string) {
        setFileUrl(url)
        setIsSuccess(true)
    }

    function handleUploadError(error: unknown) {
        setIsError(true)
        setIsFileUploading(false)
        setUploadingProgress(0)
        setIsSuccess(false)
        if (error instanceof FileError || error instanceof ValiError) {
            setError(error.message)
            return
        }
        setError("Something went wrong while uploading the file")
    }

    return {
        file,
        isSuccess,
        isFileUploading,
        error,
        isError,
        fileUrl,
        uploadingProgress,
        setFile,
    }
}
