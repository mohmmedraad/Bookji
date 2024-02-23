"use client"

import * as React from "react"
import { type Category } from "@/types"
import { Spinner } from "@nextui-org/react"
import { Cross2Icon } from "@radix-ui/react-icons"
import { Command as CommandPrimitive } from "cmdk"

import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Command, CommandGroup, CommandItem } from "@/components/ui/Command"
import { trpc } from "@/app/_trpc/client"

interface MultiSelectProps {
    selected: Category[] | null
    defaultSelected?: string[]
    setSelected: React.Dispatch<React.SetStateAction<Category[] | null>>
    onChange?: (value: Category[] | null) => void
    placeholder?: string
}

export function MultiSelect({
    selected,
    setSelected,
    onChange,
    defaultSelected = [],
    placeholder = "Select options",
}: MultiSelectProps) {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")

    const { data, isLoading } = trpc.getAllCategories.useQuery(undefined, {
        cacheTime: Infinity,
        staleTime: Infinity,
    })

    console.log("MultiSelect")
    React.useEffect(() => {
        console.log("data")
        if (defaultSelected && data) {
            const selected = data?.filter((option) =>
                defaultSelected.includes(option.name)
            )
            console.log("selected: ", selected)
            setSelected(selected ?? null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    // Register as input field to be used in react-hook-form
    React.useEffect(() => {
        if (onChange) {
            onChange(selected?.length ? selected : null)
        }
    }, [onChange, selected])

    const handleSelect = React.useCallback(
        (option: Category) => {
            setSelected((prev) => [...(prev ?? []), option])
        },
        [setSelected]
    )

    const handleRemove = React.useCallback(
        (option: Category) => {
            setSelected(
                (prev) => prev?.filter((item) => item.id !== option.id) ?? []
            )
        },
        [setSelected]
    )

    const handleKeyDown = React.useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (!inputRef.current) return

            if (event.key === "Backspace" || event.key === "Delete") {
                setSelected((prev) => prev?.slice(0, -1) ?? [])
            }

            // Blur input on escape
            if (event.key === "Escape") {
                inputRef.current.blur()
            }
        },
        [setSelected]
    )

    // Memoize filtered options to avoid unnecessary re-renders
    const filteredOptions = React.useMemo(() => {
        return data?.filter((option) => {
            if (selected?.find((item) => item.name === option.name))
                return false

            if (query.length === 0) return true

            return option.name.toLowerCase().includes(query.toLowerCase())
        })
    }, [data, query, selected])

    return (
        <Command
            onKeyDown={handleKeyDown}
            className="overflow-visible bg-transparent"
        >
            <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <div className="flex flex-wrap gap-1">
                    {selected?.map((option) => {
                        return (
                            <Badge
                                key={option.id}
                                variant="secondary"
                                className="rounded hover:bg-secondary"
                            >
                                {option.name}
                                <Button
                                    aria-label="Remove option"
                                    size="sm"
                                    className="ml-2 h-auto bg-transparent p-0 text-primary hover:bg-transparent hover:text-destructive"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            handleRemove(option)
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                    }}
                                    onClick={() => handleRemove(option)}
                                >
                                    <Cross2Icon
                                        className="h-3 w-3"
                                        aria-hidden="true"
                                    />
                                </Button>
                            </Badge>
                        )
                    })}
                    <CommandPrimitive.Input
                        ref={inputRef}
                        placeholder={placeholder}
                        autoFocus={false}
                        className="flex-1 bg-transparent px-1 py-0.5 outline-none placeholder:text-muted-foreground"
                        value={query}
                        onValueChange={setQuery}
                        onBlur={() => setOpen(false)}
                        onFocus={() => setOpen(true)}
                    />
                </div>
            </div>
            <div className="relative z-50 mt-2">
                {open ? (
                    <div className="absolute top-0 max-h-[200px] w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                        {isLoading ? (
                            <div className="flex h-32 items-center justify-center">
                                <Spinner />
                            </div>
                        ) : filteredOptions && filteredOptions?.length > 0 ? (
                            <CommandGroup className="h-full overflow-auto">
                                {filteredOptions.map((option) => {
                                    return (
                                        <CommandItem
                                            key={option.id}
                                            className="px-2 py-1.5 text-sm"
                                            onMouseDown={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                            }}
                                            onSelect={() => {
                                                handleSelect(option)
                                                setQuery("")
                                            }}
                                        >
                                            {option.name}
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </Command>
    )
}
