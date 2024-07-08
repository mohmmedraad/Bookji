import { type FC, type HTMLAttributes, type ReactNode } from "react"

import { cn } from "@/lib/utils"

interface BookWrapperProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode
}

const BookWrapper: FC<BookWrapperProps> = ({
    children,
    className,
    ...props
}) => {
    return (
        <div
            className={cn("overflow-hidden rounded-md shadow-xl", className)}
            {...props}
        >
            {children}
        </div>
    )
}

export default BookWrapper
