import { type Dispatch, type SetStateAction } from "react"
import { useRouter } from "next/navigation"
import { usePrevious } from "@mantine/hooks"
import { toast } from "sonner"

import { handleGenericError } from "@/lib/utils"
import { trpc } from "@/app/_trpc/client"

import { useStore } from "./useStore"

export const useUpdateThumbnail = (
    setOpen: Dispatch<SetStateAction<boolean>>
) => {
    const storeId = useStore((store) => store.id)
    const thumbnail = useStore((store) => store.thumbnail)
    const prevThumbnail = usePrevious(thumbnail)
    const setThumbnail = useStore((store) => store.setThumbnail)
    const storeSlug = useStore((store) => store.slug)

    const router = useRouter()
    const { mutate } = trpc.store.update.useMutation({
        onMutate(data) {
            setOpen(false)
            setThumbnail(data.thumbnail!)
            return toast.success("Your store has been updated")
        },
        onError(error) {
            setThumbnail(prevThumbnail!)
            if (error.data?.code === "UNAUTHORIZED") {
                router.push(`/sign-in?_origin=/dashboard/${storeSlug}/`)
                return toast.error("You must be logged in to update a store")
            }
            if (error.data?.code === "NOT_FOUND") {
                router.push("/dashboard/")
                return handleGenericError()
            }
            return handleGenericError()
        },
    })

    function updateThumbnail(thumbnail: string) {
        mutate({ storeId, thumbnail })
    }

    return { updateThumbnail }
}
