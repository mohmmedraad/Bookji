"use client"

import { type FC, type ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

interface LayoutProps {
    children: ReactNode
}

const queryClient = new QueryClient()

const Providers: FC<LayoutProps> = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

export default Providers
