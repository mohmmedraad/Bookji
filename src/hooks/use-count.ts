import { useEffect, useState } from "react"

const useCount = ({
    initialCountdownTime,
}: {
    initialCountdownTime: number
}) => {
    const [countdownTime, setCountdownTime] = useState(initialCountdownTime)
    const [numberOfRetry, setNumberOfRetry] = useState(0)

    useEffect(() => {
        const timerId = setInterval(() => {
            setCountdownTime((prev) => {
                const isCountdownNotComplete = prev > 0
                if (isCountdownNotComplete) return prev - 1
                stopCountdownTimer(timerId)
                return prev
            })
        }, 1000)

        return () => {
            stopCountdownTimer(timerId)
        }
    }, [initialCountdownTime, numberOfRetry])

    function restartCountdown() {
        setCountdownTime(initialCountdownTime)
        setNumberOfRetry((prev) => prev + 1)
    }

    return { countdownTime, restartCountdown, numberOfRetry }
}

function stopCountdownTimer(timerId: NodeJS.Timeout | undefined) {
    clearInterval(timerId)
}

export default useCount
