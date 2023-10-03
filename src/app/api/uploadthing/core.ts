import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const auth = (req: Request) => ({ id: "fakeId" }) // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({ image: { maxFileSize: "4MB" } })
        // Set permissions and file types for this FileRoute
        .middleware(({ req }) => {
            // This code runs on your server before upload
            const user = auth(req)

            // If you throw, the user will not be able to upload
            if (!user) throw new Error("Unauthorized")

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: user.id }
        })
        .onUploadComplete(({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
        }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
