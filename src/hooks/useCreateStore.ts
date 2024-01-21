import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { handleGenericError } from "@/lib/utils"
import { trpc } from "@/app/_trpc/client"

export const useCreateStore = () => {
    const router = useRouter()
    const { mutate: createStore } = trpc.store.create.useMutation({
        onError: (error) => {
            if (error.data?.code === "UNAUTHORIZED") {
                router.push("/login?origin=/dashboard/store/")
                return toast.error("You must be logged in to create a store")
            }

            return handleGenericError()
        },
        onSuccess: (data) => {
            // router.push(`/dashboard/stores/${data}`)
            return toast.success("Store created successfully")
        },
    })

    return createStore
}
