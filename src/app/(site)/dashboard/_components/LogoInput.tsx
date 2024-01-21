import { useEffect, type FC } from "react"

import { storeLogoSchema } from "@/lib/validations/store"
import { useUploadFile } from "@/components/uploadFileDropZone/UploadFileStore"

interface LogoInputProps {
    onChange: (logoUrl: string) => void
    className?: string
}

const LogoInput: FC<LogoInputProps> = ({ onChange, className }) => {
    const setSchema = useUploadFile((store) => store.setSchema)
    const setEndpoint = useUploadFile((store) => store.setEndpoint)
    const setOnChange = useUploadFile((store) => store.setOnChange)

    useEffect(() => {
        setSchema(storeLogoSchema)
        setEndpoint("storeLogoUploader")
        setOnChange(onChange)
    }, [onChange, setEndpoint, setOnChange, setSchema])

    return <></>
}

export default LogoInput
