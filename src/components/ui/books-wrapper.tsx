import { type FC, type HTMLAttributes, type ReactNode } from "react"

import { cn } from "@/lib/utils"

interface BooksWrapperProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode
}

const BooksWrapper: FC<BooksWrapperProps> = ({
    children,
    className,
    ...props
}) => {
    return (
        <div
            className={cn(
                "mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

export default BooksWrapper
