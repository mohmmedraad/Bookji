"use client"

import { type FC, type HTMLAttributes } from "react"
import { Search } from "lucide-react"
import { useQueryState } from "nuqs"

import { cn } from "@/lib/utils"

import { Input } from "./Input"

interface SearchBarProps extends HTMLAttributes<HTMLDivElement> {
    param?: string
}

const SearchBar: FC<SearchBarProps> = ({
    className,
    param = "text",
    ...props
}) => {
    const [textParam, setTextParam] = useQueryState(param)
    return (
        <div className={cn("relative", className)} {...props}>
            <Search className="absolute left-4 top-3 h-4 w-4 text-slate-900" />
            <Input
                className="pl-10"
                defaultValue={textParam || ""}
                placeholder="Type here to search..."
                onChange={(e) => {
                    void setTextParam(e.target.value)
                }}
            />
        </div>
    )
}

export default SearchBar
