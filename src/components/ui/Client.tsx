"use client"

import { FC, useEffect, useState } from "react"

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
