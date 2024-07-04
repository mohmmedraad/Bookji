"use client"

import * as React from "react"
import { CircularProgress } from "@nextui-org/react"
import { Cross2Icon } from "@radix-ui/react-icons"
import { Command as CommandPrimitive } from "cmdk"

import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/button"
import { Command, CommandGroup, CommandItem } from "@/components/ui/Command"
import { trpc } from "@/app/_trpc/client"

export interface Option {
    id: number
    name: string
    icon?: React.ComponentType<{ className?: string }>
}

interface MultiSelectFilterProps {
    selected: Option[] | null
    setSelected: React.Dispatch<React.SetStateAction<Option[] | null>>
    onChange?: (value: Option[] | null) => void
    placeholder?: string
}

export function MultiSelectFilter({
    selected,
    setSelected,
    onChange,
    placeholder = "Select options",
}: MultiSelectFilterProps) {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")

    const { data, isLoading } = trpc.books.categories.useQuery(undefined, {
        cacheTime: Infinity,
        staleTime: Infinity,
    })

    // Register as input field to be used in react-hook-form
    React.useEffect(() => {
        if (onChange) {
            onChange(selected?.length ? selected : null)
        }
    }, [onChange, selected])

    const handleSelect = React.useCallback(
        (option: Option) => {
            setSelected((prev) => [...(prev ?? []), option])
        },
        [setSelected]
    )

    const handleRemove = React.useCallback(
        (option: Option) => {
            setSelected((prev) => prev?.filter((item) => item !== option) ?? [])
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
            <div className="flex flex-wrap gap-1">
                {/* <div className=""> */}
                <CommandPrimitive.Input
                    ref={inputRef}
                    placeholder={placeholder}
                    className="max-w-[150px] bg-transparent px-1 py-0.5 text-sm outline-none placeholder:text-muted-foreground"
                    value={query}
                    onValueChange={setQuery}
                    onBlur={() => setOpen(false)}
                    onFocus={() => setOpen(true)}
                />
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
                {/* </div> */}
            </div>
            <div className="relative z-50 mt-2">
                {open ? (
                    // eslint-disable-next-line tailwindcss/no-custom-classname
                    <div className="absolute top-0 max-h-[200px] w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                        {isLoading ? (
                            <div className="flex h-32 items-center justify-center">
                                <CircularProgress />
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
                ) : (
                    <p className="text-sm text-muted-foreground"></p>
                )}
            </div>
        </Command>
    )
}
