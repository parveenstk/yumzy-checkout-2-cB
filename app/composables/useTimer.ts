import { ref, onUnmounted } from 'vue'

export const useTimer = (testingSeconds?: number) => {
    const minutes = ref('03')
    const seconds = ref('00')
    const isExpired = ref(false)

    // Decide duration
    const TOTAL_SECONDS =
        import.meta.dev && testingSeconds
            ? testingSeconds        // 5 sec (testing)
            : 3 * 60                // 3 min (production)

    let total = TOTAL_SECONDS
    let intervalId: ReturnType<typeof setInterval> | null = null

    const startTimer = () => {
        if (intervalId) return

        isExpired.value = false
        total = TOTAL_SECONDS

        intervalId = setInterval(() => {
            total--

            const m = Math.floor(total / 60)
            const s = total % 60

            minutes.value = String(m).padStart(2, '0')
            seconds.value = String(s).padStart(2, '0')

            if (total <= 0) {
                isExpired.value = true
                stopTimer()
            }
        }, 1000)
    }

    const stopTimer = () => {
        if (!intervalId) return
        clearInterval(intervalId)
        intervalId = null
    }

    onUnmounted(stopTimer)

    return {
        minutes,
        seconds,
        isExpired,
        startTimer,
        stopTimer
    }
}
