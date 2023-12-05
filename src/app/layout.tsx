import "@/styles/globals.css"

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "sonner"

import Providers from "@/components/Providers"

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    adjustFontFallback: false,
})
export const metadata: Metadata = {
    title: "Bookji",
    description: "Bookji is a book store that sells books and novels",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${inter.className} bg-background`}>
                    <Providers>
                        {children}
                        <Toaster />
                    </Providers>
                </body>
            </html>
        </ClerkProvider>
    )
}
