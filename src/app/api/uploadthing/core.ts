import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

const auth = (_: Request) => ({ id: "fakeId" })

export const ourFileRouter = {
    bookCoverUploader: f({ image: { maxFileSize: "1MB", maxFileCount: 1 } })
        .middleware(({ req }) => {
            const user = auth(req)

            if (!user) throw new Error("Unauthorized")

            return { userId: user.id }
        })
        .onUploadComplete(({ metadata, file }) => {
            console.log("Uploaded file", file)
            console.log("Uploaded file", metadata)
            return
            // return { uploadedBy: metadata.userId };
        }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
