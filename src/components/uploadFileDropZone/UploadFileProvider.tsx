"use client"

import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react"
import { StoreApi } from "zustand"

import {
    uploadFileStore,
    type InitialState,
} from "@/components/uploadFileDropZone/UploadFileStore"

export const UploadFileContext = createContext<ReturnType<
    typeof uploadFileStore
> | null>(null)

export const UploadFileProvider = ({
    children,
    initialValues,
}: {
    children: ReactNode
    initialValues: InitialState
}) => {
    console.log("re-rended")
    // const store = uploadFileStore({ ...initialValues })

    const store = useMemo(() => uploadFileStore({ ...initialValues }), [])
    return (
        <UploadFileContext.Provider value={store}>
            {children}
        </UploadFileContext.Provider>
    )
}
