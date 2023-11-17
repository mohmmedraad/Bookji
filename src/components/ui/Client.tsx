"use client"

import { useEffect, useState, type FC } from "react"

interface ClientProps {
    children?: React.ReactNode
}

const Client: FC<ClientProps> = ({ children }) => {
    const [isMounted, setIsMounted] = useState<boolean>(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null
    return <>{children}</>
}

export default Client
