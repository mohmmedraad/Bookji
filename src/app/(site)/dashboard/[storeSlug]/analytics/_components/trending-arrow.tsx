import { type FC, type HTMLAttributes } from "react"
import { TrendingDown, TrendingUp } from "lucide-react"

import { cn } from "@/lib/utils"

interface TrendingArrowProps extends HTMLAttributes<HTMLDivElement> {
    status: string
    percent: string
}

const TrendingArrow: FC<TrendingArrowProps> = ({
    status,
    percent,
    className,
}) => {
    return (
        <div
            className={cn(
                "flex items-center gap-1 text-sm",
                status === "up" ? "text-emerald-500" : "text-rose-500",
                className
            )}
        >
            {status === "up" ? (
                <TrendingUp className="h-5 w-5 " />
            ) : (
                <TrendingDown className="h-5 w-5 " />
            )}
            {percent}
        </div>
    )
}

export default TrendingArrow
