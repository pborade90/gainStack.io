// src/pages/Home.jsx
import { useEffect, useState } from 'react'
import { useWorkoutsContext } from '../contexts/WorkoutContext'
import { useAuthContext } from '../contexts/AuthContext'
import WorkoutDetails from '../components/WorkoutDetails'
import WorkoutForm from '../components/WorkoutForm'
import { motion } from 'framer-motion'
import { Plus, TrendingUp, Calendar, Target } from 'lucide-react'

const StatCard = ({ icon: Icon, label, value, color = 'tertiary' }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card bg-gradient-to-br from-secondary to-primary border-l-4 border-l-tertiary"
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-quaternary text-sm font-medium mb-1">{label}</p>
                <p className="text-2xl font-bold text-light">{value}</p>
            </div>
            <div className={`w-12 h-12 bg-${color}/20 rounded-xl flex items-center justify-center`}>
                <Icon className={`w-6 h-6 text-${color}`} />
            </div>
        </div>
    </motion.div>
)

const Home = () => {
    const { workouts, dispatch } = useWorkoutsContext()
    const { user } = useAuthContext()
    const [isLoading, setIsLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)

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

    // Calculate stats
    const totalWorkouts = workouts?.length || 0
    const totalVolume = workouts?.reduce((sum, workout) => {
        if (workout.unilateral) {
            return sum + ((workout.leftLoad * workout.leftReps) + (workout.rightLoad * workout.rightReps)) * workout.sets
        }
        return sum + (workout.load * workout.reps * workout.sets)
    }, 0) || 0

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-tertiary border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <p className="text-quaternary">Loading your workouts...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary to-secondary">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8"
                >
                    <div>
                        <h1 className="text-4xl font-bold text-light mb-2">
                            Welcome back, {user?.email?.split('@')[0]}!
                        </h1>
                        <p className="text-quaternary text-lg">
                            {totalWorkouts === 0
                                ? "Ready to start your fitness journey?"
                                : `You've logged ${totalWorkouts} workouts`}
                        </p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowForm(!showForm)}
                        className="mt-4 lg:mt-0 bg-gradient-to-r from-tertiary to-quaternary text-white font-bold py-3 px-6 rounded-xl flex items-center space-x-2 transition-all duration-200 hover:shadow-lg"
                    >
                        <Plus className="w-5 h-5" />
                        <span>{showForm ? 'Close Form' : 'New Workout'}</span>
                    </motion.button>
                </motion.div>

                {/* Stats */}
                {totalWorkouts > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                    >
                        <StatCard
                            icon={Calendar}
                            label="Total Workouts"
                            value={totalWorkouts}
                            color="tertiary"
                        />
                        <StatCard
                            icon={TrendingUp}
                            label="Total Volume"
                            value={`${totalVolume} kg`}
                            color="quaternary"
                        />
                        <StatCard
                            icon={Target}
                            label="This Week"
                            value="3"
                            color="light"
                        />
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Workouts List */}
                    <div className="lg:col-span-2">
                        {showForm && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-8"
                            >
                                <WorkoutForm onSuccess={() => setShowForm(false)} />
                            </motion.div>
                        )}

                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-light">Recent Workouts</h2>
                            {workouts && workouts.length > 0 && (
                                <span className="text-quaternary text-sm">
                  {workouts.length} total
                </span>
                            )}
                        </div>

                        {!workouts || workouts.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="card text-center py-16"
                            >
                                <div className="w-24 h-24 bg-tertiary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Target className="w-12 h-12 text-tertiary" />
                                </div>
                                <h3 className="text-2xl font-bold text-light mb-3">No workouts yet</h3>
                                <p className="text-quaternary mb-6 max-w-md mx-auto">
                                    Start tracking your fitness journey by adding your first workout.
                                    Monitor your progress and achieve your goals.
                                </p>
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="bg-gradient-to-r from-tertiary to-quaternary text-white font-bold py-3 px-8 rounded-xl hover:scale-105 transition-transform duration-200"
                                >
                                    Log First Workout
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                layout
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                {workouts.map((workout, index) => (
                                    <motion.div
                                        key={workout._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        layout
                                    >
                                        <WorkoutDetails workout={workout} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>

                    {/* Quick Actions Sidebar */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-6"
                        >
                            {/* Quick Stats */}
                            <div className="card">
                                <h3 className="text-lg font-bold text-light mb-4">Quick Stats</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-quaternary">This Month</span>
                                        <span className="text-light font-semibold">12 workouts</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-quaternary">PRs Set</span>
                                        <span className="text-light font-semibold">3</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-quaternary">Consistency</span>
                                        <span className="text-green-400 font-semibold">85%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="card">
                                <h3 className="text-lg font-bold text-light mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button className="w-full text-left p-3 rounded-lg bg-tertiary/10 hover:bg-tertiary/20 transition-colors text-light">
                                        Start Rest Timer
                                    </button>
                                    <button className="w-full text-left p-3 rounded-lg bg-tertiary/10 hover:bg-tertiary/20 transition-colors text-light">
                                        View Progress
                                    </button>
                                    <button className="w-full text-left p-3 rounded-lg bg-tertiary/10 hover:bg-tertiary/20 transition-colors text-light">
                                        Plate Calculator
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home