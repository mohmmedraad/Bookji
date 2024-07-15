import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserInfo } from "@/store/useUserInfo"
import { type GeneralInformationSchema } from "@/types"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { handleGenericError } from "@/lib/utils"
import { generalInformationSchema } from "@/lib/validations/auth"
import { trpc } from "@/app/_trpc/client"

interface UseGeneralInformationFormProps {
    firstName: string | null
    lastName: string | null
    username: string | null
}

export const useGeneralInformationForm = ({
    firstName,
    lastName,
    username,
}: UseGeneralInformationFormProps) => {
    const user = useUserInfo()
    const router = useRouter()

    const form = useForm<GeneralInformationSchema>({
        resolver: valibotResolver(generalInformationSchema),
        defaultValues: {
            firstName: user.firstName ?? firstName!,
            lastName: user.lastName ?? lastName!,
            username: user.username ?? username!,
        },
    })

    const firstNameValue = form.watch("firstName")
    const lastNameValue = form.watch("lastName")

    const { isLoading, mutate: updateUser } = trpc.users.updateUser.useMutation(
        {
            onSuccess: () => {
                toast.success("Profile updated successfully")
            },
            onError: (error) => {
                const errorCode = error?.data?.code

                if (errorCode === "CONFLICT") {
                    toast.error("Username is already taken by another user")
                    return form.setError("username", {
                        type: "manual",
                        message: "Username is already taken by another user",
                    })
                }

                if (errorCode === "UNAUTHORIZED") {
                    toast.error(
                        "You need to be signed in to update your profile"
                    )
                    return router.push("/sign-in?_origin=/profile")
                }

                return handleGenericError()
            },
        }
    )

    useEffect(
        () => user.setFirstName(firstNameValue),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [firstNameValue]
    )
    useEffect(
        () => user.setLastName(lastNameValue),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [lastNameValue]
    )

    function updateProfile(data: GeneralInformationSchema) {
        if (
            isSameValues(data, {
                firstName,
                lastName,
                username,
            })
        ) {
            return toast.success("Profile updated successfully")
        }

        updateUser(data)
    }

    const handleSubmit = form.handleSubmit(updateProfile)

    return {
        form,
        isLoading,
        handleSubmit,
    }
}

export function isSameValues<T extends Record<string, unknown>>(
    objectOne: T,
    objectTwo: T
) {
    for (const [key, value] of Object.entries(objectOne)) {
        if (value !== objectTwo[key]) {
            return false
        }
    }

    return true
}
