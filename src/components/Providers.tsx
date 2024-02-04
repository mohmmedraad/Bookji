"use client"

import { useState, type FC, type ReactNode } from "react"
import { NextUIProvider } from "@nextui-org/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"

import { absoluteUrl } from "@/lib/utils"
import { trpc } from "@/app/_trpc/client"

interface LayoutProps {
    children: ReactNode
}

const Providers: FC<LayoutProps> = ({ children }) => {
    const url =
        typeof window !== "undefined" ? "/api/trpc" : absoluteUrl("/api/trpc")

    const [queryClient] = useState(() => new QueryClient())
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url,
                }),
            ],
        })
    )
    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <NextUIProvider>{children}</NextUIProvider>
            </QueryClientProvider>
        </trpc.Provider>
    )
}

export default Providers
