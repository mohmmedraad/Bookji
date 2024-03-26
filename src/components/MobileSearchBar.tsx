"use client"

import { type FC, type HTMLAttributes } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { useSearchBar } from "@/hooks/useSearchBar"

interface MobileSearchBarProps extends HTMLAttributes<HTMLDivElement> {
    param?: string
    isClosed: boolean
    isFocused: () => void
    isBlurred: () => void
}

const MobileSearchBar: FC<MobileSearchBarProps> = ({
    param = "text",
    isClosed,
    className,
    isFocused,
    isBlurred,
}) => {
    const { text, setText } = useSearchBar(param)

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
                    value={text || ""}
                    placeholder={"Type here to search..."}
                    onChange={(e) => void setText(e.target.value)}
                    onFocus={isFocused}
                    onBlur={() => isBlurred()}
                    autoFocus
                />
            )}
        </motion.div>
    )
}

export default MobileSearchBar
