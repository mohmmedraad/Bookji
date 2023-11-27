"use client"

import {
    useEffect,
    useState,
    type FC,
    type HTMLAttributes,
    type ReactElement,
} from "react"
import { type StarType } from "@/types"
import { Star, StarHalf } from "lucide-react"

import { cn } from "@/lib/utils"

interface StarsProps {
    isStatic?: boolean
    stars?: StarType
    className?: HTMLAttributes<HTMLDivElement>["className"]
    starsClassName?: HTMLAttributes<HTMLDivElement>["className"]
    onChose?: (rate: StarType) => void
    onChange?: (rate: number) => void
}

const Stars: FC<StarsProps> = ({
    isStatic = false,
    stars,
    className,
    starsClassName,
    onChange,
    onChose,
}) => {
    const [star, setStar] = useState<StarType>(stars || 0)

    function handleClicked(index: number) {
        if (isStatic) return
        setStar(index)
        onChose && onChose(index)
    }

    function getStars() {
        const stars: ReactElement[] = []
        let hasHalf = star % 1 >= 0.5
        const starsCount = Math.floor(star)

        for (let i = 1; i <= 5; i++) {
            if (i <= starsCount) {
                stars.push(
                    <Star
                        className={cn(
                            "h-6 w-6 cursor-pointer fill-primary text-primary",
                            starsClassName
                        )}
                        key={i}
                        onClick={() => handleClicked(i)}
                    />
                )
            } else if (hasHalf) {
                stars.push(
                    <StarHalf
                        className={cn(
                            "h-6 w-6 cursor-pointer fill-primary text-primary",
                            starsClassName
                        )}
                        key={i}
                        onClick={() => handleClicked(i)}
                    />
                )
                hasHalf = false
            } else {
                stars.push(
                    <Star
                        className={cn(
                            "h-6 w-6 cursor-pointer text-primary",
                            starsClassName
                        )}
                        key={i}
                        onClick={() => handleClicked(i)}
                    />
                )
            }
        }
        return stars
    }

    useEffect(() => {
        if (onChange) {
            onChange(star + 1)
        }
    }, [onChange, star])

    return (
        <div className={cn("mt-4 flex items-center gap-8", className)}>
            {getStars()}
        </div>
    )
}

export default Stars
