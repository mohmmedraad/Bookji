import { type Endpoint } from "@/types"
import { type BlobSchema } from "valibot"
import { createStore } from "zustand"

interface Store {
    schema?: BlobSchema<Blob>
    endpoint?: Endpoint
    uploadedFileUrl?: string
    file: File | null
    fileUrl: string | undefined
    isFileUploading: boolean
    isFileUploaded: boolean
    uploadingProgress: number
    error: string
    isError: boolean
    uploadContent?: React.ReactNode

    onChange?: (fileUrl: string) => void
    setUploadedFileUrl: (uploadedFile: string) => void
    setFile: (file: Blob) => void
    setFileUrl: (fileUrl: string | undefined) => void
    setIsFileUploading: (isFileUploading: boolean) => void
    setUploadingProgress: (uploadingProgress: number) => void
    setError: (error: string) => void
}

export type InitialState = Partial<Store>
export const uploadFileStore = (initialState: InitialState) =>
    createStore<Store>((set, get) => ({
        uploadContent: initialState.uploadContent,
        schema: initialState.schema,
        endpoint: initialState.endpoint,
        uploadedFileUrl: "",
        onChange: initialState.onChange,
        file: null,
        fileUrl: "",
        isFileUploading: false,
        isFileUploaded: false,
        uploadingProgress: 0,
        error: "",
        isError: false,
        setUploadedFileUrl: (uploadedFileUrl: string) =>
            set({ uploadedFileUrl }),
        setFile: (file: Blob) => set({ file: file as File }),
        setFileUrl: (fileUrl: string | undefined) => set({ fileUrl }),
        setIsFileUploading: (isFileUploading: boolean) =>
            set({ isFileUploading }),
        setUploadingProgress: (uploadingProgress: number) => {
            set({ uploadingProgress })
            if (get().uploadingProgress >= 100) {
                set({ isFileUploaded: true })
            }
        },
        setError: (error: string) => {
            if (!error) {
                set({ isError: false })
                set({ error: "" })
                return
            }

            set({ isError: true })
            set({ error })
            set({ file: null })
        },
    }))
