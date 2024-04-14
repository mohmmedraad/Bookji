/** @type {import('next').NextConfig} */
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

module.exports = nextConfig
