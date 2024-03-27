"use client"

import { type ComponentProps, type FC } from "react"
import { Progress } from "@nextui-org/react"

const ProgressBar: FC<ComponentProps<typeof Progress>> = ({ ...props }) => {
    return <Progress {...props} />
}

export default ProgressBar
