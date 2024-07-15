import { useRouter } from "next/navigation"
import { useStore } from "@/store/useStore"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { pick } from "valibot"

import { handleGenericError } from "@/lib/utils"
import { newStoreSchema, type StoreInfoSchema } from "@/lib/validations/store"
import { trpc } from "@/app/_trpc/client"

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

type DefaultValues = StoreInfoSchema

export const useUpdateStore = (defaultValues: DefaultValues) => {
    const form = useForm<StoreInfoSchema>({
        resolver: valibotResolver(
            pick(newStoreSchema, ["name", "description"])
        ),
        defaultValues,
    })
    const router = useRouter()
    const storeName = useStore((store) => store.name)
    const storeDescription = useStore((store) => store.description || "")
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
                router.push(`/sign-in?_origin=/dashboard/${storeSlug}/`)
                return toast.error("You must be logged in to update a store")
            }

            if (error.data?.code === "NOT_FOUND") {
                router.push("/dashboard/")
                return handleGenericError()
            }

            if (error.data?.code === "CONFLICT") {
                form.setError("name", {
                    message: "A Store with same name already exists",
                })
                return toast.error("A Store with same name already exists")
            }

            return handleGenericError()
        },
    })

    function updateStore(data: StoreInfoSchema) {
        const values = getValues(data, {
            name: storeName,
            description: storeDescription,
        })

        if (!values) {
            return toast.success("Your store has been updated")
        }
        mutate({ storeId, ...values })
    }

    return { updateStore, isLoading, form }
}
