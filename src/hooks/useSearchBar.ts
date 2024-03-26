import { useEffect, useState } from "react"
import { useQueryState } from "nuqs"

import useDebounce from "./useDebounce"
import { useIsMount } from "./useIsMount"

export const useSearchBar = (param: string = "text") => {
    const [textParam, setTextParam] = useQueryState(param, {
        history: "push",
    })
    const isMount = useIsMount()

    const [text, setText] = useState<string | null>(textParam || "")

    const textValue = useDebounce(text, 500)

    useEffect(() => {
        // preventing the initial render from setting the query param
        if (textValue === null || !isMount) return

        void setTextParam(textValue)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [textValue])

    useEffect(() => {
        if (textParam === text) return
        setText(textParam)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [textParam])

    return {
        text,
        setText,
    }
}
