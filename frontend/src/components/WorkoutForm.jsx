// src/components/WorkoutForm.jsx
import { useState } from 'react'
import { useWorkoutsContext } from '../contexts/WorkoutContext'
import { useAuthContext } from '../contexts/AuthContext'
import { useRestTimer } from '../contexts/RestTimerContext'
import PlateCalculator from './PlateCalculator'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Dumbbell, Activity, Calendar } from 'lucide-react'

const WorkoutForm = ({ onSuccess }) => {
    const { dispatch } = useWorkoutsContext()
    const { user } = useAuthContext()
    const { dispatch: timerDispatch } = useRestTimer()

    const [formData, setFormData] = useState({
        title: '',
        load: '',
        reps: '',
        sets: '1',
        notes: '',
        unilateral: false,
        leftLoad: '',
        rightLoad: '',
        leftReps: '',
        rightReps: ''
    })
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            setError('You must be logged in')
            return
        }

        const workoutData = {
            title: formData.title.trim(),
            sets: parseInt(formData.sets) || 1,
            notes: formData.notes,
            unilateral: formData.unilateral
        }

        if (formData.unilateral) {
            workoutData.leftLoad = parseFloat(formData.leftLoad) || 0
            workoutData.rightLoad = parseFloat(formData.rightLoad) || 0
            workoutData.leftReps = parseInt(formData.leftReps) || 0
            workoutData.rightReps = parseInt(formData.rightReps) || 0
        } else {
            workoutData.load = parseFloat(formData.load) || 0
            workoutData.reps = parseInt(formData.reps) || 0
        }

        // Validation
        let emptyFields = []
        if (!workoutData.title) emptyFields.push('title')
        if (!workoutData.unilateral) {
            if (!workoutData.load) emptyFields.push('load')
            if (!workoutData.reps) emptyFields.push('reps')
        } else {
            if (!workoutData.leftLoad) emptyFields.push('leftLoad')
            if (!workoutData.rightLoad) emptyFields.push('rightLoad')
            if (!workoutData.leftReps) emptyFields.push('leftReps')
            if (!workoutData.rightReps) emptyFields.push('rightReps')
        }

        if (emptyFields.length > 0) {
            setError('Please fill in all required fields')
            setEmptyFields(emptyFields)
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/workouts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(workoutData)
            })

            if (!response.ok) {
                let errorMessage = 'Failed to create workout'
                try {
                    const errorData = await response.json()
                    errorMessage = errorData.error || errorMessage
                } catch (parseError) {
                    errorMessage = `Server error: ${response.status} ${response.statusText}`
                }
                throw new Error(errorMessage)
            }

            const text = await response.text()
            const json = text ? JSON.parse(text) : {}

            // Reset form
            setFormData({
                title: '',
                load: '',
                reps: '',
                sets: '1',
                notes: '',
                unilateral: false,
                leftLoad: '',
                rightLoad: '',
                leftReps: '',
                rightReps: ''
            })
            setError(null)
            setEmptyFields([])

            // Dispatch to context
            dispatch({ type: 'CREATE_WORKOUT', payload: json })

            // Start rest timer based on rep range
            const repCount = formData.unilateral
                ? Math.max(parseInt(formData.leftReps), parseInt(formData.rightReps))
                : parseInt(formData.reps)

            let restTime = 60 // Default 60 seconds
            if (repCount <= 5) restTime = 180 // 3 minutes for strength
            else if (repCount <= 12) restTime = 90 // 90 seconds for hypertrophy

            timerDispatch({ type: 'START_TIMER', duration: restTime })

            // Call success callback if provided
            if (onSuccess) onSuccess()

        } catch (error) {
            console.error('Error creating workout:', error)
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card border-l-4 border-l-tertiary"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-tertiary rounded-xl flex items-center justify-center">
                        <Dumbbell className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-light">Log New Workout</h3>
                        <p className="text-quaternary text-sm">Track your progress and stay consistent</p>
                    </div>
                </div>
                {onSuccess && (
                    <button
                        onClick={onSuccess}
                        className="text-quaternary hover:text-light transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Exercise Name */}
                <div>
                    <label className="block text-light text-sm font-semibold mb-2 flex items-center space-x-2">
                        <Activity className="w-4 h-4" />
                        <span>Exercise Name *</span>
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className={`input-field ${emptyFields.includes('title') ? 'border-red-500' : ''}`}
                        placeholder="e.g., Bench Press, Squat, Deadlift"
                        disabled={isLoading}
                    />
                </div>

                {/* Unilateral Toggle */}
                <div className="flex items-center space-x-3 p-4 bg-primary/50 rounded-xl">
                    <input
                        type="checkbox"
                        id="unilateral"
                        checked={formData.unilateral}
                        onChange={(e) => handleInputChange('unilateral', e.target.checked)}
                        className="w-4 h-4 text-tertiary bg-secondary border-quaternary rounded focus:ring-tertiary"
                        disabled={isLoading}
                    />
                    <label htmlFor="unilateral" className="text-light text-sm font-medium">
                        Single Arm/Leg Exercise
                    </label>
                </div>

                <AnimatePresence mode="wait">
                    {!formData.unilateral ? (
                        <motion.div
                            key="bilateral"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                            <div>
                                <label className="block text-light text-sm font-semibold mb-2">
                                    Load (kg) *
                                </label>
                                <div className="flex space-x-2">
                                    <input
                                        type="number"
                                        value={formData.load}
                                        onChange={(e) => handleInputChange('load', e.target.value)}
                                        className={`input-field ${emptyFields.includes('load') ? 'border-red-500' : ''}`}
                                        placeholder="0"
                                        step="0.5"
                                        disabled={isLoading}
                                    />
                                    <PlateCalculator load={parseFloat(formData.load) || 0} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-light text-sm font-semibold mb-2">
                                    Reps *
                                </label>
                                <input
                                    type="number"
                                    value={formData.reps}
                                    onChange={(e) => handleInputChange('reps', e.target.value)}
                                    className={`input-field ${emptyFields.includes('reps') ? 'border-red-500' : ''}`}
                                    placeholder="0"
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="block text-light text-sm font-semibold mb-2 flex items-center space-x-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>Sets</span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.sets}
                                    onChange={(e) => handleInputChange('sets', e.target.value)}
                                    className="input-field"
                                    placeholder="1"
                                    disabled={isLoading}
                                />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="unilateral"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Side */}
                                <div className="card bg-primary/30">
                                    <h4 className="text-light font-bold mb-4 text-center">Left Side *</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-quaternary text-sm font-medium mb-1">
                                                Load (kg)
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.leftLoad}
                                                onChange={(e) => handleInputChange('leftLoad', e.target.value)}
                                                className={`input-field text-sm ${emptyFields.includes('leftLoad') ? 'border-red-500' : ''}`}
                                                placeholder="0"
                                                step="0.5"
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-quaternary text-sm font-medium mb-1">
                                                Reps
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.leftReps}
                                                onChange={(e) => handleInputChange('leftReps', e.target.value)}
                                                className={`input-field text-sm ${emptyFields.includes('leftReps') ? 'border-red-500' : ''}`}
                                                placeholder="0"
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side */}
                                <div className="card bg-primary/30">
                                    <h4 className="text-light font-bold mb-4 text-center">Right Side *</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-quaternary text-sm font-medium mb-1">
                                                Load (kg)
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.rightLoad}
                                                onChange={(e) => handleInputChange('rightLoad', e.target.value)}
                                                className={`input-field text-sm ${emptyFields.includes('rightLoad') ? 'border-red-500' : ''}`}
                                                placeholder="0"
                                                step="0.5"
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-quaternary text-sm font-medium mb-1">
                                                Reps
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.rightReps}
                                                onChange={(e) => handleInputChange('rightReps', e.target.value)}
                                                className={`input-field text-sm ${emptyFields.includes('rightReps') ? 'border-red-500' : ''}`}
                                                placeholder="0"
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-light text-sm font-semibold mb-2">
                                    Sets
                                </label>
                                <input
                                    type="number"
                                    value={formData.sets}
                                    onChange={(e) => handleInputChange('sets', e.target.value)}
                                    className="input-field"
                                    placeholder="1"
                                    disabled={isLoading}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Notes */}
                <div>
                    <label className="block text-light text-sm font-semibold mb-2">
                        Workout Notes
                    </label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        className="input-field resize-none"
                        rows={3}
                        placeholder="How did it feel? Any adjustments needed? Progress notes..."
                        maxLength={500}
                        disabled={isLoading}
                    />
                    <div className="text-right text-quaternary text-xs mt-1">
                        {formData.notes.length}/500
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-500/10 border border-red-500/20 rounded-xl p-4"
                    >
                        <p className="text-red-400 text-sm flex items-center space-x-2">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </p>
                    </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    className="w-full btn-primary py-4 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            <span>Adding Workout...</span>
                        </div>
                    ) : (
                        'Add Workout & Start Timer'
                    )}
                </motion.button>
            </form>
        </motion.div>
    )
}

export default WorkoutForm