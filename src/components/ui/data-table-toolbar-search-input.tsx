import { useEffect, useState, type FC, type InputHTMLAttributes } from "react"
import { useRouter } from "next/navigation"
import { useQueryState } from "nuqs"

import useDebounce from "@/hooks/useDebounce"

import { Input } from "./input"

interface DataTableToolbarSearchInputProps
    extends InputHTMLAttributes<HTMLInputElement> {
    defaultValue?: string
}

const DataTableToolbarSearchInput: FC<DataTableToolbarSearchInputProps> = ({
    defaultValue,
    placeholder,
}) => {
    const [textQuery, setTextQuery] = useQueryState("text")
    const searchValue = useDebounce(textQuery)
    const router = useRouter()

    useEffect(() => {
        if (searchValue === null) return
        const url = new URL(window.location.href)
        router.push(url.toString(), { scroll: true })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchValue])

    return (
        <Input
            className="h-8 w-[150px] lg:w-[250px]"
            placeholder={placeholder || "Search..."}
            defaultValue={textQuery || ""}
            onChange={(event) => void setTextQuery(event.target.value)}
        />
    )
}

export default DataTableToolbarSearchInput
