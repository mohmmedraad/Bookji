import { useEffect, useState } from "react"

export const useIsMount = () => {
    const [isMount, setIsMount] = useState(false)

    useEffect(() => {
        if (window === undefined) return

        setIsMount(true)
    }, [])

    return isMount
}
