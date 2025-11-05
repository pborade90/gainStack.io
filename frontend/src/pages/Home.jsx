import { useEffect, useState } from 'react'
import { useWorkoutsContext } from '../contexts/WorkoutContext'  // Fixed import
import { useAuthContext } from '../contexts/AuthContext'  // Fixed import
import WorkoutDetails from '../components/WorkoutDetails'
import WorkoutForm from "../components/WorkoutForm";

const Home = () => {
    const { workouts, dispatch } = useWorkoutsContext();
    const { user } = useAuthContext();
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchWorkouts = async () => {
            if (!user) return

            try {
                const response = await fetch('/api/workouts', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                })

                const json = await response.json()

                if (response.ok) {
                    dispatch({ type: 'SET_WORKOUTS', payload: json })
                }
            } catch (error) {
                console.error('Error fetching workouts:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchWorkouts()
    }, [dispatch, user])

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tertiary"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Workouts List */}
                <div className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-light">Your Workouts</h1>
                        <div className="text-quaternary">
                            {workouts ? `${workouts.length} workouts` : 'No workouts'}
                        </div>
                    </div>

                    {!workouts || workouts.length === 0 ? (
                        <div className="card text-center py-12">
                            <svg className="w-16 h-16 text-quaternary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-xl font-semibold text-light mb-2">No workouts yet</h3>
                            <p className="text-quaternary mb-4">Start by adding your first workout below!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {workouts.map((workout) => (
                                <WorkoutDetails key={workout._id} workout={workout} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Workout Form */}
                <div className="lg:col-span-1">
                    <WorkoutForm />
                </div>
            </div>
        </div>
    )
}

export default Home