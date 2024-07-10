"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

type option = {
    value: string
    label: string
}

interface ComboboxProps {
    options: option[]
    name: string
    setFun: (value: string) => void
}

export const FilterCombobox: React.FC<ComboboxProps> = ({
    name,
    options,
    setFun,
}) => {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState(options[0].value)

    React.useEffect(() => {
        setFun(value)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" role="combobox" aria-expanded={open}>
                    {value
                        ? options.find((option) => option.value === value)
                              ?.label
                        : `Select ${name}...`}
                    <ChevronDown
                        className={cn(
                            "ml-2 h-4 w-4 shrink-0 text-gray-600 opacity-50 transition-transform duration-100 ease-in",
                            {
                                "rotate-180": open,
                            }
                        )}
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder={`Search ${name}...`} />
                    <CommandEmpty>No {name} found.</CommandEmpty>
                    <CommandGroup>
                        {options.map((option) => (
                            <CommandItem
                                key={option.value}
                                value={option.value}
                                onSelect={(currentValue) => {
                                    setValue(
                                        currentValue === value
                                            ? ""
                                            : currentValue
                                    )
                                    setOpen(false)
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === option.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                                {option.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
