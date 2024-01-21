import { useEffect, type FC } from "react"

import { useUploadFile } from "@/components/uploadFileDropZone/UploadFileStore"

interface LogoInputProps {
    onChange: (logoUrl: string) => void
    className?: string
}

const LogoInput: FC<LogoInputProps> = ({ onChange, className }) => {
    const isFileUploaded = useUploadFile((store) => store.isFileUploaded)
    const uploadedFileUrl = useUploadFile((store) => store.uploadedFileUrl)
    useEffect(() => {
        if (isFileUploaded) {
            onChange(uploadedFileUrl!)
        }
    }, [isFileUploaded, onChange, uploadedFileUrl])
    return <></>
}

export default LogoInput
