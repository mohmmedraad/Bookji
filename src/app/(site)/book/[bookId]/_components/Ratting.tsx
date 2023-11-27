"use client"

import { useState, type FC } from "react"
import { type TRPCErrorType } from "@/types"
import { toast } from "sonner"

import { handleGenericError } from "@/lib/utils"
import { type RateBookSchema } from "@/lib/validations/book"
import { useSignIn } from "@/hooks/useSignIn"
import { trpc } from "@/app/_trpc/client"

import RatingDialog from "./RatingDialog"

interface RateProps {
    title: string
    bookId: string
}

const Ratting: FC<RateProps> = ({ title, bookId }) => {
    const [open, setOpen] = useState(false)

    const { signIn } = useSignIn()

    const { mutate: rateBook } = trpc.rateBook.useMutation({
        onError: (error) => {
            const code = error.data?.code
            const message = error.message
            handleTRPCError({ code, message })
        },
        onSuccess: () => {
            /**
             * TODO: revalidate the rating section
             */
        },
        retry: 0,
    })

    function handleTRPCError(error: TRPCErrorType) {
        if (error.code === "UNAUTHORIZED") {
            toast.error("You need to be logged in to rate a book")
            return signIn()
        }
        if (error.code === "BAD_REQUEST") {
            setOpen(true)
            return toast.error(error.message)
        }
        if (error.code === "CONFLICT") return toast.error(error.message)

        return handleGenericError()
    }

    function onSubmit(data: RateBookSchema) {
        console.log(data)
        rateBook({ ...data, bookId })
        setOpen(false)
        toast.success("Rating added")
        /**
         * TODO: revalidate the book page
         */
    }

    return (
        <>
            <p className="text-sm text-gray-900">Rate {title}</p>
            <p className="mt-2 text-xs text-gray-500">
                Tell other what your thinks
            </p>
            <RatingDialog
                open={open}
                title={title}
                onSubmit={onSubmit}
                setOpen={setOpen}
                bookId={bookId}
            />
        </>
    )
}

export default Ratting
