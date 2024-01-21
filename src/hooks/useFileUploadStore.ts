import { useContext } from "react"
import { useStore } from "zustand"

import { UploadFileContext } from "@/components/uploadFileDropZone/UploadFileProvider"

export const useFileUploadStore = () => {
    const store = useContext(UploadFileContext)
    if (store === null) {
        throw new Error("no provider")
    }
    return useStore(store)
}
