import React from "react"

import ClearFiltersButton from "./ClearFiltersButton"
import { ScrollArea } from "./ScrollArea"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./Sheet"

interface FilterProps {
    renderButton: React.FC
    renderTitle: React.FC
    renderDescription?: React.FC
    children: React.ReactNode
}

const Filter: React.FC<FilterProps> = ({
    renderButton,
    renderTitle,
    renderDescription,
    children,
}) => {
    return (
        <Sheet>
            <SheetTrigger asChild>{renderButton({})}</SheetTrigger>
            <SheetContent className="w-full xs:w-96">
                <SheetHeader>
                    <SheetTitle>{renderTitle({})}</SheetTitle>
                    {renderDescription ? (
                        <SheetDescription>
                            {renderDescription({})}
                        </SheetDescription>
                    ) : null}
                </SheetHeader>
                <div className="flex h-full flex-col gap-5">
                    <ScrollArea className="h-full w-full">
                        {children}
                    </ScrollArea>
                    <div className="shrink-0 py-4">
                        <ClearFiltersButton className="w-full">
                            Clear filters
                        </ClearFiltersButton>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default Filter
