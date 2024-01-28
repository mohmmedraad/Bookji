"use client"

import { useState, type Dispatch, type FC, type SetStateAction } from "react"
import { type StarType } from "@/types"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { Skeleton } from "@nextui-org/react"
import { useForm } from "react-hook-form"
import { omit } from "valibot"

import { rateBookSchema, type RateBookSchema } from "@/lib/validations/book"
import useBook from "@/hooks/useBook"
import { Button } from "@/components/ui/Button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/Form"
import { Textarea } from "@/components/ui/Textarea"
import { trpc } from "@/app/_trpc/client"

import Stars from "./Stars"

interface RatingDialogProps {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    onSubmit: (data: RateBookSchema) => void
}

const defaultValues: Omit<RateBookSchema, "bookId"> = {
    comment: "",
    rating: 0,
}

const RatingDialog: FC<RatingDialogProps> = ({ open, setOpen, onSubmit }) => {
    const [star, setRate] = useState<StarType>()
    const form = useForm<RateBookSchema>({
        resolver: valibotResolver(omit(rateBookSchema, ["bookId"])),
        defaultValues,
    })
    const book = useBook((state) => state.book)

    const { data, isFetching } = trpc.getUserRating.useQuery({
        bookId: book?.id || 0,
    })

    return (
        <>
            {isFetching ? (
                <div className="mt-4 flex items-center gap-8">
                    {new Array(5).fill(0).map((_, i) => (
                        <Skeleton key={i} className="star h-6 w-6" />
                    ))}
                </div>
            ) : (
                <Stars
                    onChose={(rate) => {
                        setOpen(true)
                        setRate(rate)
                    }}
                    isStatic={!!data}
                    stars={data?.rating || 0}
                />
            )}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rate {book?.title}</DialogTitle>
                        <DialogDescription>
                            Reviews art public and Include your account and
                            device information
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form
                            onSubmit={(event) => {
                                event.preventDefault()
                                void form.handleSubmit(onSubmit)(event)
                            }}
                            className="grid  gap-8"
                        >
                            <FormField
                                control={form.control}
                                name="rating"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Stars stars={star} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="comment"
                                render={({ field }) => (
                                    <FormItem className="mb-4">
                                        <FormControl>
                                            <Textarea
                                                rows={4}
                                                placeholder="Describe your experience"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                className="w-full"
                                disabled={form.formState.isSubmitting}
                                type="submit"
                            >
                                Publish
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default RatingDialog
