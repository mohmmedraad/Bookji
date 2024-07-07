import React from "react"

import { cn } from "@/lib/utils"

interface FilterOptionProps extends React.HTMLAttributes<HTMLDivElement> {}

const FilterOption: React.FC<FilterOptionProps> = ({
    children,
    className,
    ...props
}) => {
    return (
        <div className={cn("space-y-4", className)} {...props}>
            {children}
        </div>
    )
}

export default FilterOption
