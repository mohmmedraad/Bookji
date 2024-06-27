/** @type {import('next').NextConfig} */
import MillionLint from "@million/lint"

const nextConfig = {
    images: {
        domains: ["img.clerk.com", "uploadthing.com", "utfs.io"],
    },
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
}

export default MillionLint.next({ rsc: true })(nextConfig)
