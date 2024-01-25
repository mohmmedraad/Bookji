import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { handleGenericError } from "@/lib/utils"
import { type StoreInfoSchema } from "@/lib/validations/store"
import { trpc } from "@/app/_trpc/client"

import { useStore } from "./useStore"

export function getValues(data: StoreInfoSchema, store: StoreInfoSchema) {
    const values = new Map<string, string>()

    for (const [key, value] of Object.entries(data)) {
        if (value !== store[key as keyof typeof store]) {
            values.set(key, value)
        }
    }

    if (values.size === 0) {
        return
    }

    return Object.fromEntries(values)
}

export const useUpdateStore = () => {
    const router = useRouter()
    const store = useStore((store) => ({
        name: store.name,
        description: store.description || "",
    }))
    const storeId = useStore((store) => store.id)
    const storeSlug = useStore((store) => store.slug)

    const { mutate, isLoading } = trpc.store.update.useMutation({
        onMutate() {},
        onSuccess(slug) {
            if (slug) {
                const newPath = `/dashboard/${slug}`
                router.replace(newPath)
            }
            toast.success("Your store has been updated")
            return
        },
        onError(error) {
            if (error.data?.code === "UNAUTHORIZED") {
                router.push(`/sign-in?origin=/dashboard/${storeSlug}/`)
                return toast.error("You must be logged in to update a store")
            }

            if (error.data?.code === "NOT_FOUND") {
                router.push("/dashboard/")
                return handleGenericError()
            }

            return handleGenericError()
        },
    })

    function updateStore(data: StoreInfoSchema) {
        const values = getValues(data, store)

        if (!values) {
            return toast.success("Your store has been updated")
        }
        mutate({ storeId, ...values })
    }

    return { updateStore, isLoading }
}
