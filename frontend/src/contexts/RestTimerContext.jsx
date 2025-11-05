import { createContext, useContext, useReducer, useEffect } from 'react'

const RestTimerContext = createContext()

const restTimerReducer = (state, action) => {
    switch (action.type) {
        case 'START_TIMER':
            return {
                isActive: true,
                timeLeft: action.duration,
                duration: action.duration
            }
        case 'TICK':
            return {
                ...state,
                timeLeft: state.timeLeft - 1
            }
        case 'STOP_TIMER':
            return {
                isActive: false,
                timeLeft: 0,
                duration: 0
            }
        case 'PAUSE_TIMER':
            return {
                ...state,
                isActive: false
            }
        case 'RESUME_TIMER':
            return {
                ...state,
                isActive: true
            }
        default:
            return state
    }
}

export const RestTimerProvider = ({ children }) => {
    const [state, dispatch] = useReducer(restTimerReducer, {
        isActive: false,
        timeLeft: 0,
        duration: 0
    })

    useEffect(() => {
        let interval = null

        if (state.isActive && state.timeLeft > 0) {
            interval = setInterval(() => {
                dispatch({ type: 'TICK' })
            }, 1000)
        } else if (state.timeLeft === 0 && state.isActive) {
            dispatch({ type: 'STOP_TIMER' })
            // Play notification sound
            if (Notification.permission === 'granted') {
                new Notification('Rest Time Over!', {
                    body: 'Time for your next set!',
                    icon: '/dumbbell.svg'
                })
            }
        }

        return () => clearInterval(interval)
    }, [state.isActive, state.timeLeft])

    return (
        <RestTimerContext.Provider value={{ ...state, dispatch }}>
            {children}
        </RestTimerContext.Provider>
    )
}

export const useRestTimer = () => {
    const context = useContext(RestTimerContext)
    if (!context) {
        throw new Error('useRestTimer must be used inside a RestTimerProvider')
    }
    return context
}