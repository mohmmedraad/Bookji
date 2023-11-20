"use client"

import { useEffect, useState, type FC, type HTMLAttributes } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import useDebounce from "@/hooks/useDebounce"

interface MobileSearchBarProps extends HTMLAttributes<HTMLDivElement> {
    isClosed: boolean
    onValueChange: (value: string) => void
    isFocused: () => void
    isBlurred: () => void
}

const MobileSearchBar: FC<MobileSearchBarProps> = ({
    isClosed,
    className,
    onValueChange,
    isFocused,
    isBlurred,
}) => {
    const [inputValue, setInputValue] = useState("")
    const searchValue = useDebounce<string>(inputValue)

    useEffect(() => {
        onValueChange(searchValue)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchValue])

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
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    // onFocus={isFocused}
                    onBlur={() => isBlurred()}
                    autoFocus
                />
            )}
        </motion.div>
    )
}

export default MobileSearchBar
