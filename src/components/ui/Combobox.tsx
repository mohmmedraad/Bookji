"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/Command"

export interface Option {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
}

interface ComboboxDemoProps {
    onChange?: (value: string | null) => void
    placeholder?: string
    options: Option[]
}

export const Combobox: React.FC<ComboboxDemoProps> = ({
    options,
    onChange,
    placeholder,
}) => {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState(options[0].value)

    const [query, setQuery] = React.useState("")

    React.useEffect(() => {
        console.log(value)
        if (onChange) {
            onChange(value)
        }
    }, [onChange, value])

    return (
        <Command>
            {/* <Popover open={open} onOpenChange={setOpen}> */}
            {/* <PopoverTrigger asChild> */}
            {/* <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"> */}

            <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
            >
                {value
                    ? options.find((option) => option.value === value)?.label
                    : placeholder}
                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                {/* </div> */}
            </Button>
            {/* </PopoverTrigger> */}
            {/* <PopoverContent className="pointer-events-auto w-[200px] p-0"> */}
            <Command>
                <CommandInput
                    placeholder={placeholder}
                    value={query}
                    onValueChange={setQuery}
                    className="pointer-events-auto h-9"
                />
                {open && (
                    <div className="absolute top-0 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onMouseDown={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                    }}
                                    onSelect={(currentValue) => {
                                        setValue(
                                            currentValue === value
                                                ? ""
                                                : currentValue
                                        )
                                        setOpen(false)
                                        setQuery("")
                                    }}
                                >
                                    {option.label}
                                    <CheckIcon
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            value === option.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </div>
                )}
            </Command>
            {/* </PopoverContent> */}
            {/* </Popover> */}
        </Command>
    )
}
