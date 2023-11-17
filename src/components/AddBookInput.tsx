"use client"

import { useState, type ChangeEvent, type FC, type HTMLAttributes } from "react"
import { Trash, Upload } from "lucide-react"
import { type UseFormReturn } from "react-hook-form"
import { parse, ValiError } from "valibot"

import { bookCoverSchema } from "@/lib/validations/book"

import Book from "./ui/BookCover"
import { Button } from "./ui/Button"
import { Label } from "./ui/Label"

interface AddBookInputProps extends HTMLAttributes<HTMLDivElement> {
    onFile: (file: Blob | null) => void
}

const AddBookInput: FC<AddBookInputProps> = ({ onFile }) => {
    const [image, setImage] = useState<string | ArrayBuffer | null>(null)
    const [errorMessage, setErrorMessage] = useState<string>("")

    function handleOnFileChange(e: ChangeEvent<HTMLInputElement>) {
        /**
         * TODO: return error if file is not null
         */
        if (!e.target.files) return
        try {
            handleCoverFile(e.target.files[0])
        } catch (error) {
            handleCoverError(error)
        }
    }

    function handleCoverFile(cover: File) {
        parse(bookCoverSchema, cover)
        const reader = new FileReader()
        reader.onloadend = () => {
            setImage(reader.result)
        }
        reader.readAsDataURL(cover)
        onFile(cover)
    }

    function handleCoverError(error: unknown) {
        setImage(null)
        onFile(null)
        if (error instanceof ValiError) {
            return setErrorMessage(error.message)
        }
        return setErrorMessage("Something went wrong while uploading the file")
    }

    function handleRemoveCover() {
        setImage(null)
        onFile(null)
        setErrorMessage("")
    }

    return (
        <>
            {image ? (
                <div className="w-[176px]">
                    <Book
                        // @ts-expect-error image is a string
                        src={image}
                        alt="image"
                        width={176}
                        height={264}
                        className="aspect-[2/3] w-full"
                    />
                    <Button
                        variant={"destructive"}
                        className="mt-4 w-full"
                        onClick={handleRemoveCover}
                    >
                        <Trash className="h-6 w-6 text-white" />
                    </Button>
                </div>
            ) : (
                <div className="aspect-[2/3] max-w-[176px]">
                    <Label htmlFor="cover" className="block h-full w-full">
                        <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 rounded-md border-[1px] border-dashed border-primary bg-primary/10 p-6">
                            <div className="flex items-center justify-center rounded-full border-[1px] border-solid border-gray-100 bg-background p-3">
                                <Upload className="h-4 w-4 text-primary" />
                            </div>
                            <p className="text-center text-xs text-gray-800">
                                <span className="text-primary">
                                    Click to upload
                                </span>{" "}
                                or drag and drop PNG, JPG, and max image size
                                (1MB)
                            </p>
                            <input
                                name="cover"
                                id="cover"
                                type="file"
                                className="absolute inset-0 opacity-0"
                                accept=".jpg, .jpeg, .png, .webp"
                                onChange={handleOnFileChange}
                            />
                        </div>
                    </Label>
                    {errorMessage ? (
                        <p className="mt-2 text-[0.8rem] font-medium text-destructive">
                            {errorMessage}
                        </p>
                    ) : null}
                </div>
            )}
        </>
    )
}

export default AddBookInput
