import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { handleGenericError } from "@/lib/utils"
import { trpc } from "@/app/_trpc/client"

import { useStore } from "./useStore"

export const useDeleteStore = () => {
    const storeId = useStore((store) => store.id)
    const storeSlug = useStore((store) => store.slug)
    const router = useRouter()
    const { mutate, isLoading } = trpc.store.delete.useMutation({
        onSuccess: () => {
            toast.success("Store deleted successfully")
            router.push("/dashboard")
            return
        },
        onError: (error) => {
            const errorCode = error?.data?.code
            if (errorCode === "UNAUTHORIZED") {
                toast.error("You must be logged in to delete a store")
                router.push(`sign-in?_origin=/dashboard/${storeSlug}`)
                return
            }

            if (errorCode === "NOT_FOUND") {
                toast.error("Store not found")
                router.push("/dashboard")
                return
            }

            return handleGenericError()
        },
    })

    function handleDeleteStore() {
        mutate({ storeId })
    }

    return { handleDeleteStore, isLoading }
}
