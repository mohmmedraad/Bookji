import { type FC } from "react"

import { Label } from "./Label"
import { cn } from "@/lib/utils"

interface FilterLabelProps extends React.HTMLAttributes<HTMLLabelElement>{
}

const FilterLabel: FC<FilterLabelProps> = ({children, className,...props }) => {
    return (
        <Label className={cn("text-sm font-medium tracking-wide text-foreground", className)} {...props}>
            {children}
        </Label>
    )
}

export default FilterLabel
