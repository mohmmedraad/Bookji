import { type Dispatch, type SetStateAction } from "react"
import { useRouter } from "next/navigation"
import { usePrevious } from "@mantine/hooks"
import { toast } from "sonner"

import { handleGenericError } from "@/lib/utils"
import { trpc } from "@/app/_trpc/client"

import { useStore } from "@/store/useStore"

export const useUpdateLogo = (setOpen: Dispatch<SetStateAction<boolean>>) => {
    const storeId = useStore((store) => store.id)
    const logo = useStore((store) => store.logo)
    const prevLogo = usePrevious(logo)
    const setLogo = useStore((store) => store.setLogo)
    const storeSlug = useStore((store) => store.slug)

    const router = useRouter()
    const { mutate } = trpc.store.update.useMutation({
        onMutate(data) {
            setOpen(false)
            setLogo(data.logo!)
            return toast.success("Your store has been updated")
        },
        onError(error) {
            setLogo(prevLogo!)
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

    function updateLogo(logo: string) {
        mutate({ storeId, logo })
    }

    return { updateLogo }
}
