import { type FC, type HtmlHTMLAttributes, type ReactNode } from "react"

import { type Testimonial } from "@/config/site"
import { cn } from "@/lib/utils"

import { Icons } from "./Icons"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"

interface TestimonialCardProps
    extends Testimonial,
        HtmlHTMLAttributes<HTMLDivElement> {
    children?: ReactNode
}

const TestimonialCard: FC<TestimonialCardProps> = ({
    name,
    avatar,
    jobTitle,
    comment,
    children,
    className,
}) => {
    return (
        <div
            className={cn(
                "grid  gap-8 rounded-xl bg-white p-8 shadow-lg",
                className
            )}
        >
            {children}
            <Icons.Quote />
            <p className="text-base text-gray-500">{comment}</p>
            <div className="flex gap-4">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={avatar} alt={name} loading="lazy" />
                    <span className="sr-only">{name}</span>
                </Avatar>
                <div>
                    <p className="text-sm font-bold">{name}</p>
                    <p className="text-xs text-gray-500">{jobTitle}</p>
                </div>
            </div>
        </div>
    )
}

export default TestimonialCard
