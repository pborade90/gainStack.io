import { useState } from 'react'
import { useWorkoutsContext } from '../contexts/WorkoutContext'
import { useAuthContext } from '../contexts/AuthContext'
import { useRestTimer } from '../contexts/RestTimerContext'
import PlateCalculator from './PlateCalculator'

const WorkoutForm = () => {
    const { dispatch } = useWorkoutsContext()
    const { user } = useAuthContext()
    const { dispatch: timerDispatch } = useRestTimer()

    const [title, setTitle] = useState('')
    const [load, setLoad] = useState('')
    const [reps, setReps] = useState('')
    const [sets, setSets] = useState('1')
    const [notes, setNotes] = useState('')
    const [unilateral, setUnilateral] = useState(false)
    const [leftLoad, setLeftLoad] = useState('')
    const [rightLoad, setRightLoad] = useState('')
    const [leftReps, setLeftReps] = useState('')
    const [rightReps, setRightReps] = useState('')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            setError('You must be logged in')
            return
        }

        const workoutData = {
            title,
            sets: parseInt(sets) || 1,
            notes,
            unilateral
        }

        if (unilateral) {
            workoutData.leftLoad = parseFloat(leftLoad) || 0
            workoutData.rightLoad = parseFloat(rightLoad) || 0
            workoutData.leftReps = parseInt(leftReps) || 0
            workoutData.rightReps = parseInt(rightReps) || 0
        } else {
            workoutData.load = parseFloat(load) || 0
            workoutData.reps = parseInt(reps) || 0
        }

        // Validation
        let emptyFields = []
        if (!title.trim()) emptyFields.push('title')
        if (!unilateral) {
            if (!load) emptyFields.push('load')
            if (!reps) emptyFields.push('reps')
        } else {
            if (!leftLoad) emptyFields.push('leftLoad')
            if (!rightLoad) emptyFields.push('rightLoad')
            if (!leftReps) emptyFields.push('leftReps')
            if (!rightReps) emptyFields.push('rightReps')
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

            // Check if response is OK and has content
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

            // Try to parse JSON only if there's content
            const text = await response.text()
            const json = text ? JSON.parse(text) : {}

            // Reset form
            setTitle('')
            setLoad('')
            setReps('')
            setSets('1')
            setNotes('')
            setLeftLoad('')
            setRightLoad('')
            setLeftReps('')
            setRightReps('')
            setError(null)
            setEmptyFields([])

            // Dispatch to context
            dispatch({ type: 'CREATE_WORKOUT', payload: json })

            // Start rest timer based on rep range
            const repCount = unilateral ? Math.max(parseInt(leftReps), parseInt(rightReps)) : parseInt(reps)
            let restTime = 60 // Default 60 seconds

            if (repCount <= 5) restTime = 180 // 3 minutes for strength
            else if (repCount <= 12) restTime = 90 // 90 seconds for hypertrophy

            timerDispatch({ type: 'START_TIMER', duration: restTime })

        } catch (error) {
            console.error('Error creating workout:', error)
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="card animate-fade-in">
            <h3 className="text-xl font-bold text-light mb-4">Add New Workout</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-quaternary text-sm font-medium mb-1">
                        Exercise *
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={`input-field ${emptyFields.includes('title') ? 'border-red-500' : ''}`}
                        placeholder="e.g., Bench Press, Squat"
                        disabled={isLoading}
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="unilateral"
                        checked={unilateral}
                        onChange={(e) => setUnilateral(e.target.checked)}
                        className="w-4 h-4 text-tertiary bg-secondary border-quaternary rounded focus:ring-tertiary"
                        disabled={isLoading}
                    />
                    <label htmlFor="unilateral" className="text-quaternary text-sm">
                        Unilateral Exercise (Single Arm/Leg)
                    </label>
                </div>

                {!unilateral ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-quaternary text-sm font-medium mb-1">
                                Load (kg) *
                            </label>
                            <div className="flex space-x-2">
                                <input
                                    type="number"
                                    value={load}
                                    onChange={(e) => setLoad(e.target.value)}
                                    className={`input-field ${emptyFields.includes('load') ? 'border-red-500' : ''}`}
                                    placeholder="0"
                                    step="0.5"
                                    disabled={isLoading}
                                />
                                <PlateCalculator load={parseFloat(load) || 0} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-quaternary text-sm font-medium mb-1">
                                Reps *
                            </label>
                            <input
                                type="number"
                                value={reps}
                                onChange={(e) => setReps(e.target.value)}
                                className={`input-field ${emptyFields.includes('reps') ? 'border-red-500' : ''}`}
                                placeholder="0"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-quaternary text-sm font-medium mb-1">
                                Sets
                            </label>
                            <input
                                type="number"
                                value={sets}
                                onChange={(e) => setSets(e.target.value)}
                                className="input-field"
                                placeholder="1"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-light font-medium mb-2">Left Side *</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-quaternary text-sm font-medium mb-1">
                                            Load (kg)
                                        </label>
                                        <input
                                            type="number"
                                            value={leftLoad}
                                            onChange={(e) => setLeftLoad(e.target.value)}
                                            className={`input-field ${emptyFields.includes('leftLoad') ? 'border-red-500' : ''}`}
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
                                            value={leftReps}
                                            onChange={(e) => setLeftReps(e.target.value)}
                                            className={`input-field ${emptyFields.includes('leftReps') ? 'border-red-500' : ''}`}
                                            placeholder="0"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-light font-medium mb-2">Right Side *</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-quaternary text-sm font-medium mb-1">
                                            Load (kg)
                                        </label>
                                        <input
                                            type="number"
                                            value={rightLoad}
                                            onChange={(e) => setRightLoad(e.target.value)}
                                            className={`input-field ${emptyFields.includes('rightLoad') ? 'border-red-500' : ''}`}
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
                                            value={rightReps}
                                            onChange={(e) => setRightReps(e.target.value)}
                                            className={`input-field ${emptyFields.includes('rightReps') ? 'border-red-500' : ''}`}
                                            placeholder="0"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-quaternary text-sm font-medium mb-1">
                                Sets
                            </label>
                            <input
                                type="number"
                                value={sets}
                                onChange={(e) => setSets(e.target.value)}
                                className="input-field"
                                placeholder="1"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-quaternary text-sm font-medium mb-1">
                        Notes (Optional)
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="input-field resize-none"
                        rows={3}
                        placeholder="How did it feel? Any adjustments needed?"
                        maxLength={500}
                        disabled={isLoading}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-primary py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Adding Workout...' : 'Add Workout'}
                </button>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 rounded-lg p-3">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}
            </form>
        </div>
    )
}

export default WorkoutForm