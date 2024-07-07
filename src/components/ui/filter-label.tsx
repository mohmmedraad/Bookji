import { type FC } from "react"

import { cn } from "@/lib/utils"

import { Label } from "./label"

interface FilterLabelProps extends React.HTMLAttributes<HTMLLabelElement> {}

const FilterLabel: FC<FilterLabelProps> = ({
    children,
    className,
    ...props
}) => {
    return (
        <Label
            className={cn(
                "text-sm font-medium tracking-wide text-foreground",
                className
            )}
            {...props}
        >
            {children}
        </Label>
    )
}

export default FilterLabel
