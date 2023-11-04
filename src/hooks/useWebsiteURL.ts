import { useEffect, useRef } from "react"

export const useWebsiteURL = () => {
    const urlRef = useRef<URL | null>(null)
    useEffect(() => {
        urlRef.current = new URL(window.location.href)
    }, [])
    return { websiteURL: urlRef.current?.origin }
}
