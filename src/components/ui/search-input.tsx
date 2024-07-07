"use client"

import { useEffect, useState, type FC, type HTMLAttributes } from "react"
import { useQueryState } from "nuqs"

import { cn } from "@/lib/utils"
import useDebounce from "@/hooks/useDebounce"
import { useIsMount } from "@/hooks/useIsMount"

import { Input } from "./input"

interface SearchInputProps extends HTMLAttributes<HTMLInputElement> {
    param?: string
}

const SearchInput: FC<SearchInputProps> = ({ param = "text", ...props }) => {
    const [textParam, setTextParam] = useQueryState(param)
    const [inputValue, setInputValue] = useState(textParam || "")
    const debouncedInputValue = useDebounce(inputValue)
    const isMount = useIsMount()

    useEffect(() => {
        if (!isMount) return

        void setTextParam(debouncedInputValue)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedInputValue])

    return (
        <Input
            defaultValue={textParam || ""}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type to search..."
            {...props}
        />
    )
}

export default SearchInput
