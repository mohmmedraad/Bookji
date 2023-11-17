import { type FC, type HTMLAttributes, type ReactNode } from "react"

import { cn } from "@/lib/utils"

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode
}

const Container: FC<ContainerProps> = ({ className, children }) => {
    return (
        <div
            className={cn(
                "mx-auto w-full max-w-screen-xl px-6 sm:px-10",
                className
            )}
        >
            {children}
        </div>
    )
}

export default Container
