import { type FC } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/store/useStore"
import { toast } from "sonner"

import { trpc } from "@/app/_trpc/client"

import { UserAvatar } from "../UserAvatar"
import MultiSelectFilterOption from "./multi-select-filter-option"

interface CustomersFilterOptionProps {}

const CustomersFilterOption: FC<CustomersFilterOptionProps> = ({}) => {
    const router = useRouter()
    const storeId = useStore((store) => store.id)
    const storeSlug = useStore((store) => store.slug)
    const {
        data: customers,
        isLoading,
        isError,
    } = trpc.store.customersInfo.useQuery(
        { storeId },
        {
            onError: (error) => {
                const errorCode = error?.data?.code
                if (errorCode === "UNAUTHORIZED") {
                    toast.error("You are not authorized to view this page")
                    return router.push(
                        `/sign-in?_origin=/dashboard/${storeSlug}`
                    )
                }
                if (errorCode === "NOT_FOUND") {
                    return router.push("/dashboard")
                }
            },
            cacheTime: Infinity,
            staleTime: Infinity,
        }
    )

    let options: {
        id: string
        name: string
        imageUrl: string | null
        firstName: string | null
        lastName: string | null
    }[] = []

    if (!isError && customers) {
        options = customers.map(({ username, ...rest }) => ({
            id: username!,
            name: username!,
            ...rest,
        }))
    }

    return (
        <MultiSelectFilterOption
            param="customers"
            data={options}
            isLoading={isLoading}
            renderOption={(option) => (
                <div className="flex items-center justify-center gap-1">
                    <UserAvatar
                        user={{
                            firstName: option.firstName,
                            lastName: option.lastName,
                            imageUrl: option.imageUrl || "/placeholder.png",
                        }}
                        className="h-6 w-6 border-[1px] border-solid border-gray-400"
                    />
                    <span>{option.name}</span>
                </div>
            )}
        />
    )
}

export default CustomersFilterOption
