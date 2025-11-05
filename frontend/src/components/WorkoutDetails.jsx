// src/components/WorkoutDetails.jsx
import { useWorkoutsContext } from '../contexts/WorkoutContext'
import { useAuthContext } from '../contexts/AuthContext'
import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import { Trash2, Dumbbell, Activity, Calendar } from 'lucide-react'

const WorkoutDetails = ({ workout }) => {
    const { dispatch } = useWorkoutsContext()
    const { user } = useAuthContext()

    const handleDelete = async () => {
        if (!user) return

        try {
            const response = await fetch(`/api/workouts/${workout._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })

            const json = await response.json()

            if (response.ok) {
                dispatch({ type: 'DELETE_WORKOUT', payload: json })
            }
        } catch (error) {
            console.error('Error deleting workout:', error)
        }
    }

    const calculateVolume = () => {
        if (workout.unilateral) {
            return ((workout.leftLoad * workout.leftReps) + (workout.rightLoad * workout.rightReps)) * workout.sets
        }
        return workout.load * workout.reps * workout.sets
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -2 }}
            className="card group hover:border-tertiary/40 transition-all duration-300 border-l-4 border-l-tertiary"
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-tertiary/20 rounded-xl flex items-center justify-center">
                        <Dumbbell className="w-5 h-5 text-tertiary" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-light">{workout.title}</h4>
                        <div className="flex items-center space-x-2 text-quaternary text-sm">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</span>
                        </div>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleDelete}
                    className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-quaternary hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg"
                    title="Delete workout"
                >
                    <Trash2 className="w-4 h-4" />
                </motion.button>
            </div>

            {/* Workout Data */}
            {workout.unilateral ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-primary/30 rounded-xl">
                            <div className="text-sm text-quaternary mb-2">Left Side</div>
                            <div className="text-2xl font-bold text-light mb-1">
                                {workout.leftLoad}kg
                            </div>
                            <div className="text-quaternary text-sm">
                                {workout.leftReps} reps
                            </div>
                        </div>
                        <div className="text-center p-4 bg-primary/30 rounded-xl">
                            <div className="text-sm text-quaternary mb-2">Right Side</div>
                            <div className="text-2xl font-bold text-light mb-1">
                                {workout.rightLoad}kg
                            </div>
                            <div className="text-quaternary text-sm">
                                {workout.rightReps} reps
                            </div>
                        </div>
                    </div>
                    <div className="text-center text-sm text-quaternary bg-primary/20 py-2 rounded-lg">
                        {workout.sets} sets • {calculateVolume()} kg total volume
                    </div>
                </div>
            ) : (
                <div className="text-center space-y-3">
                    <div className="text-3xl font-black text-light bg-gradient-to-r from-tertiary to-quaternary bg-clip-text text-transparent">
                        {workout.load}kg × {workout.reps}
                    </div>
                    <div className="text-sm text-quaternary bg-primary/20 py-2 rounded-lg">
                        {workout.sets} sets • {calculateVolume()} kg total volume
                    </div>
                </div>
            )}

            {/* Notes */}
            {workout.notes && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-3 bg-primary/30 rounded-lg border border-quaternary/10"
                >
                    <div className="flex items-center space-x-2 text-quaternary text-sm mb-1">
                        <Activity className="w-3 h-3" />
                        <span>Notes</span>
                    </div>
                    <p className="text-light text-sm leading-relaxed">{workout.notes}</p>
                </motion.div>
            )}
        </motion.div>
    )
}

export default WorkoutDetails