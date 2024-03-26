"use client"

import { type FC, type HTMLAttributes } from "react"

import { Button } from "./Button"

interface ClearFiltersButtonProps extends HTMLAttributes<HTMLButtonElement> {}

const ClearFiltersButton: FC<ClearFiltersButtonProps> = ({
    children,
    ...props
}) => {
    function handleClearFilters() {
        if (window === undefined) return

        window.history.replaceState(null, "", window.location.pathname)
    }

    return (
        <Button {...props} onClick={handleClearFilters}>
            {children}
        </Button>
    )
}

export default ClearFiltersButton
