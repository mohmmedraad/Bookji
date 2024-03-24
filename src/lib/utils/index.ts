import type { SearchParams } from "@/types"
import { clsx, type ClassValue } from "clsx"
import slugifyStr from "slugify"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"

export function isInputEmpty(obj: Record<string, unknown>) {
    for (const value of Object.values(obj)) {
        if (value !== null && value !== undefined) {
            return false
        }
    }

    return true
}

export function handleGenericError() {
    toast.error("Something went wrong. Please try again later.")
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
    // if (typeof window !== "undefined") return path
    console.log("NEXT_PUBLIC_VERCEL_URL: ", process.env.NEXT_PUBLIC_VERCEL_URL)
    if (process.env.NEXT_PUBLIC_VERCEL_URL)
        return `${process.env.NEXT_PUBLIC_VERCEL_URL}${path}`
    return `http://localhost:${process.env.PORT ?? 3000}${path}`
}

export function slugify(str: string) {
    return slugifyStr(str, { lower: true })
}

export function formatDate(
    date: Date | string | number,
    options: Intl.DateTimeFormatOptions = {
        month: "long",
        day: "numeric",
        year: "numeric",
    }
) {
    return new Intl.DateTimeFormat("en-US", {
        ...options,
    }).format(new Date(date))
}

export function searchParamsString(searchParams: SearchParams) {
    const searchParamsString = new URLSearchParams(searchParams).toString()
    return searchParamsString ? `?${searchParamsString}` : ""
}
