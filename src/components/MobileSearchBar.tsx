"use client"

import { type FC, type HTMLAttributes } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { useQueryState } from "nuqs"

import { cn } from "@/lib/utils"

interface MobileSearchBarProps extends HTMLAttributes<HTMLDivElement> {
    isClosed: boolean
    isFocused: () => void
    isBlurred: () => void
}

const MobileSearchBar: FC<MobileSearchBarProps> = ({
    isClosed,
    className,
    isFocused,
    isBlurred,
}) => {
    const [textParam, setTextParam] = useQueryState("text")

    return (
        <motion.div
            className={cn(
                "relative flex h-9 origin-left items-center gap-2 rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm",
                {
                    "ring-1 ring-ring": !isClosed,
                },
                className
            )}
            variants={{
                closed: {
                    width: "auto",
                },
                opened: {
                    width: "100%",
                },
            }}
            transition={{ duration: 0.1 }}
            initial="closed"
            animate={isClosed ? "closed" : "opened"}
            onClick={isFocused}
        >
            <Search className={"h-4 w-4 text-slate-900"} />
            {isClosed ? null : (
                <input
                    className="outline-none placeholder:text-muted-foreground"
                    placeholder={"Type here to search..."}
                    defaultValue={textParam || ""}
                    onChange={(e) => void setTextParam(e.target.value)}
                    onFocus={isFocused}
                    onBlur={() => isBlurred()}
                    autoFocus
                />
            )}
        </motion.div>
    )
}

export default MobileSearchBar
