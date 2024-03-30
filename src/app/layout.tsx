import "@/styles/globals.css"

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from "sonner"

import { site } from "@/config/site"
import Providers from "@/components/Providers"

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    adjustFontFallback: false,
})

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
    title: {
        default: site.title,
        template: `${site.name} | %s`,
    },
    description: site.description,
    keywords: site.keywords,
    authors: site.authors,
    creator: site.creator,
    generator: "Next.js",
    category: "e-commerce",
    openGraph: {
        type: "website",
        locale: "en_US",
        title: site.title,
        siteName: site.name,
        description: site.description,
        url: site.url,
        images: [
            {
                url: `${site.url}/opengraph-image.jpg`,
                width: 1200,
                height: 630,
                alt: site.name,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: site.name,
        description: site.description,
        images: [`${site.url}/opengraph-image.jpg`],
        creator: site.links.x,
    },
    icons: {
        icon: `${site.url}/icon.png`,
    },
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
                        <Toaster richColors />
                    </Providers>
                    <SpeedInsights />
                </body>
            </html>
        </ClerkProvider>
    )
}
