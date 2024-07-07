import {
    ArrowDownIcon,
    ArrowUpIcon,
    CaretSortIcon,
    EyeNoneIcon,
} from "@radix-ui/react-icons"
import { type Column } from "@tanstack/react-table"
import { useQueryState } from "nuqs"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableColumnHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>
    title: string
    sortByKey?: string
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
    sortByKey,
}: DataTableColumnHeaderProps<TData, TValue>) {
    const [searchQuery, setSearchQuery] = useQueryState("sortBy")

    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>
    }

    function handleSorting(sortType: string) {
        const sortBy = `${sortByKey}.${sortType}`
        void setSearchQuery(sortBy)
    }

    function getIsSorted(sortType: string) {
        return searchQuery === `${sortByKey}.${sortType}`
    }

    return (
        <div className={cn("flex items-center space-x-2", className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-3 h-8 data-[state=open]:bg-accent"
                    >
                        <span>{title}</span>
                        {getIsSorted("desc") ? (
                            <ArrowDownIcon className="ml-2 h-4 w-4" />
                        ) : getIsSorted("asc") ? (
                            <ArrowUpIcon className="ml-2 h-4 w-4" />
                        ) : (
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => handleSorting("asc")}>
                        <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSorting("desc")}>
                        <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Desc
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                    // onClick={() => column.toggleVisibility(false)}
                    >
                        <EyeNoneIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Hide
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
