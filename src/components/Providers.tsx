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

// const queryClient = new QueryClient()
// const trpcClient = trpc.createClient({
//     links: [
//         httpBatchLink({
//             url: `http://localhost:3000/api/trpc`,
//         }),
//     ],
// })

const Providers: FC<LayoutProps> = ({ children }) => {
    const [queryClient] = useState(() => new QueryClient())
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: "http://localhost:3000/api/trpc",
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
