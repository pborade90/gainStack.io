import { useRestTimer } from '../contexts/RestTimerContext'

const RestTimer = () => {
    const { isActive, timeLeft, duration, dispatch } = useRestTimer()

    if (!isActive) return null

    const progress = ((duration - timeLeft) / duration) * 100
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60

    const getTimerColor = () => {
        if (timeLeft > 60) return 'text-green-400'
        if (timeLeft > 30) return 'text-yellow-400'
        return 'text-red-400'
    }

    return (
        <div className="fixed bottom-6 right-6 w-72 card animate-slide-up z-50">
            <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-semibold text-light">Rest Timer</h4>
                <div className="flex space-x-2">
                    <button
                        onClick={() => dispatch({ type: 'PAUSE_TIMER' })}
                        className="text-quaternary hover:text-light transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => dispatch({ type: 'STOP_TIMER' })}
                        className="text-quaternary hover:text-red-400 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                <div className="text-center">
                    <div className={`text-3xl font-bold ${getTimerColor()}`}>
                        {minutes}:{seconds.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-quaternary mt-1">
                        Time until next set
                    </div>
                </div>

                <div className="w-full bg-primary rounded-full h-2">
                    <div
                        className="bg-tertiary h-2 rounded-full transition-all duration-1000 ease-linear"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                {timeLeft <= 10 && (
                    <div className="text-center">
                        <div className="text-xs text-red-400 font-semibold animate-pulse">
                            Almost ready!
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RestTimer