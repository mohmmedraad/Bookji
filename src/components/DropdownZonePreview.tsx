import { type FC, type HTMLAttributes } from "react"
import { CircularProgress } from "@nextui-org/react"
import { Trash } from "lucide-react"

import { cn } from "@/lib/utils"

import Book from "./ui/BookCover"
import BookWrapper from "./ui/BookWrapper"
import { Button } from "./ui/Button"

interface DropdownZonePreviewProps extends HTMLAttributes<HTMLDivElement> {
    cover: string | ArrayBuffer | null
    uploadProgress: number
    handleRemoveFile: () => void
}

const DropdownZonePreview: FC<DropdownZonePreviewProps> = ({
    cover,
    uploadProgress,
    className,
    handleRemoveFile,
    ...props
}) => {
    return (
        <div className={className} {...props}>
            <BookWrapper className="relative w-full">
                {uploadProgress >= 100 ? null : (
                    <div className="absolute inset-0 z-50 flex aspect-[2/3] items-center justify-center bg-background/80 backdrop-blur-sm">
                        <CircularProgress
                            aria-label="uploading..."
                            size="md"
                            value={uploadProgress}
                            color="success"
                            showValueLabel={true}
                            maxValue={100}
                        />
                    </div>
                )}
                <Book
                    // @ts-expect-error cover is a string
                    src={cover}
                    alt="cover"
                    width={176}
                    height={264}
                    className="aspect-[2/3] w-full"
                />
            </BookWrapper>
            <Button
                variant={"destructive"}
                className="mt-4 w-full"
                onClick={handleRemoveFile}
                disabled={uploadProgress < 100}
            >
                <Trash className="h-6 w-6 text-white" />
            </Button>
        </div>
    )
}

export default DropdownZonePreview
