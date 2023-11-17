import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const auth = (req: Request) => ({ id: "fakeId" }) // Fake auth function

export const ourFileRouter = {
    imageUploader: f({ image: { maxFileSize: "1MB" } })
        .middleware(({ req }) => {
            const user = auth(req)

            if (!user) throw new Error("Unauthorized")

            return { userId: user.id }
        })
        .onUploadComplete(({ metadata, file }) => {
            // return { uploadedBy: metadata.userId
        }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
