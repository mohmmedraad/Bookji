"use client"

import { type ComponentProps, type FC } from "react"
import { useRouter } from "next/navigation"

import { Button } from "./button"

interface GoBackButtonProps extends ComponentProps<typeof Button> {}

const GoBackButton: FC<GoBackButtonProps> = ({ children, ...props }) => {
    const router = useRouter()
    return (
        <Button {...props} onClick={() => router.back()}>
            {children}
        </Button>
    )
}

export default GoBackButton
