import { useEffect, useState } from "react"

const COUNTDOWN_TIME = 10

const useCount = () => {
    const [countdownTime, setCountdownTime] = useState(COUNTDOWN_TIME)
    const [numberOfRetry, setNumberOfRetry] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            console.log("timer rerendered")
            setCountdownTime((prev) => {
                const isNotCountdownComplete = prev > 0
                if (isNotCountdownComplete) return prev - 1
                clearInterval(timer)
                return prev
            })
        }, 1000)

        return () => {
            clearInterval(timer)
        }
    }, [numberOfRetry])

    function restartCountdown() {
        setCountdownTime(COUNTDOWN_TIME)
        setNumberOfRetry((prev) => prev + 1)
    }

    return { countdownTime, restartCountdown, numberOfRetry }
}

export default useCount
