// src/components/RestTimer.jsx
import { useRestTimer } from '../contexts/RestTimerContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, X, Bell } from 'lucide-react'

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

    const getProgressColor = () => {
        if (timeLeft > 60) return 'bg-green-400'
        if (timeLeft > 30) return 'bg-yellow-400'
        return 'bg-red-400'
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                className="fixed bottom-6 right-6 w-80 card border-l-4 border-l-tertiary shadow-2xl z-50"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-tertiary rounded-lg flex items-center justify-center">
                            <Bell className="w-4 h-4 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-light">Rest Timer</h4>
                    </div>

                    <div className="flex space-x-1">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => dispatch({ type: 'PAUSE_TIMER' })}
                            className="text-quaternary hover:text-light transition-colors p-2"
                        >
                            <Pause className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => dispatch({ type: 'STOP_TIMER' })}
                            className="text-quaternary hover:text-red-400 transition-colors p-2"
                        >
                            <X className="w-4 h-4" />
                        </motion.button>
                    </div>
                </div>

                {/* Timer Content */}
                <div className="space-y-4">
                    {/* Time Display */}
                    <div className="text-center">
                        <div className={`text-4xl font-black ${getTimerColor()} mb-2`}>
                            {minutes}:{seconds.toString().padStart(2, '0')}
                        </div>
                        <div className="text-xs text-quaternary">
                            Time until next set
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-primary rounded-full h-2">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1 }}
                            className={`h-2 rounded-full ${getProgressColor()} transition-colors duration-300`}
                        />
                    </div>

                    {/* Warning Message */}
                    {timeLeft <= 10 && timeLeft > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <div className="text-sm text-red-400 font-semibold animate-pulse flex items-center justify-center space-x-2">
                                <Bell className="w-4 h-4" />
                                <span>Almost ready!</span>
                            </div>
                        </motion.div>
                    )}

                    {timeLeft === 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <div className="text-sm text-green-400 font-semibold">
                                Time's up! Start your next set 💪
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export default RestTimer