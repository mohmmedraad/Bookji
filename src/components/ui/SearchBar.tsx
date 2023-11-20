"use client"

import { useEffect, useState, type FC, type HTMLAttributes } from "react"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import useDebounce from "@/hooks/useDebounce"

import { Input } from "./Input"

interface SearchBarProps extends HTMLAttributes<HTMLDivElement> {
    onValueChange: (value: string) => void
}

const SearchBar: FC<SearchBarProps> = ({
    onValueChange,
    className,
    ...props
}) => {
    const [inputValue, setInputValue] = useState("")
    const searchValue = useDebounce<string>(inputValue)

    useEffect(() => {
        onValueChange(searchValue)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchValue])

    return (
        <div className={cn("relative", className)} {...props}>
            <Search className="absolute left-4 top-3 h-4 w-4 text-slate-900" />
            <Input
                className="pl-10"
                placeholder="Type here to search..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
        </div>
    )
}

export default SearchBar
