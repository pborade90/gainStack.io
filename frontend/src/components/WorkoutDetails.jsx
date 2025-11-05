import { useWorkoutsContext } from '../contexts/WorkoutContext'  // Fixed import
import { useAuthContext } from '../contexts/AuthContext'  // Fixed import
import { formatDistanceToNow } from 'date-fns'

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

    return (
        <div className="card animate-slide-up group hover:border-quaternary/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
                <h4 className="text-lg font-bold text-light">{workout.title}</h4>
                <button
                    onClick={handleDelete}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-quaternary hover:text-red-400"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>

            {workout.unilateral ? (
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                            <div className="text-sm text-quaternary mb-1">Left Side</div>
                            <div className="text-light font-semibold">
                                {workout.leftLoad}kg × {workout.leftReps}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-quaternary mb-1">Right Side</div>
                            <div className="text-light font-semibold">
                                {workout.rightLoad}kg × {workout.rightReps}
                            </div>
                        </div>
                    </div>
                    <div className="text-center text-sm text-quaternary">
                        {workout.sets} sets
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <div className="text-2xl font-bold text-light mb-2">
                        {workout.load}kg × {workout.reps}
                    </div>
                    <div className="text-sm text-quaternary">
                        {workout.sets} sets
                    </div>
                </div>
            )}

            {workout.notes && (
                <div className="mt-3 p-3 bg-primary/50 rounded-lg">
                    <p className="text-sm text-quaternary">{workout.notes}</p>
                </div>
            )}

            <div className="mt-4 text-xs text-quaternary">
                {formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}
            </div>
        </div>
    )
}

export default WorkoutDetails