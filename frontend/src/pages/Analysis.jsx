// src/pages/Analysis.jsx
import { useEffect, useState } from 'react'
import { useAuthContext } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import { TrendingUp, AlertTriangle, CheckCircle, Activity } from 'lucide-react'

const AnalysisCard = ({ analysis, index }) => {
    const getImbalanceColor = (imbalance) => {
        if (Math.abs(imbalance) > 10) return 'text-red-400'
        if (Math.abs(imbalance) > 5) return 'text-yellow-400'
        return 'text-green-400'
    }

    const getImbalanceBg = (imbalance) => {
        if (Math.abs(imbalance) > 10) return 'bg-red-500/10 border-red-500/20'
        if (Math.abs(imbalance) > 5) return 'bg-yellow-500/10 border-yellow-500/20'
        return 'bg-green-500/10 border-green-500/20'
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card hover:scale-105 transition-transform duration-300"
        >
            <h3 className="text-xl font-bold text-light mb-4 flex items-center space-x-2">
                <Activity className="w-5 h-5 text-tertiary" />
                <span>{analysis.exercise}</span>
            </h3>

            <div className="space-y-4">
                {/* Strength Comparison */}
                <div className="flex justify-between items-center">
                    <div className="text-center">
                        <div className="text-sm text-quaternary mb-1">Left Side</div>
                        <div className="text-2xl font-bold text-light">
                            {analysis.leftAvg} <span className="text-sm text-quaternary">kg·reps</span>
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="text-sm text-quaternary mb-1">Right Side</div>
                        <div className="text-2xl font-bold text-light">
                            {analysis.rightAvg} <span className="text-sm text-quaternary">kg·reps</span>
                        </div>
                    </div>
                </div>

                {/* Imbalance Bar */}
                <div className="bg-primary rounded-xl p-4">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-quaternary">Strength Imbalance</span>
                        <span className={`text-sm font-bold ${getImbalanceColor(analysis.imbalance)}`}>
              {Math.abs(analysis.imbalance)}%
            </span>
                    </div>

                    <div className="w-full bg-secondary rounded-full h-3 relative">
                        <div
                            className="h-3 rounded-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 relative"
                            style={{ width: '100%' }}
                        >
                            <div
                                className="absolute top-0 w-1 h-4 -mt-0.5 bg-white rounded-full shadow-lg"
                                style={{
                                    left: `${50 + (analysis.imbalance / 2)}%`,
                                    transform: 'translateX(-50%)'
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between text-xs text-quaternary mt-2">
                        <span>Left Stronger</span>
                        <span>Balanced</span>
                        <span>Right Stronger</span>
                    </div>
                </div>

                {/* Recommendation */}
                {Math.abs(analysis.imbalance) > 5 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-4 rounded-xl border ${getImbalanceBg(analysis.imbalance)}`}
                    >
                        <div className="flex items-start space-x-3">
                            {Math.abs(analysis.imbalance) > 10 ? (
                                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                            ) : (
                                <CheckCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                            )}
                            <div>
                                <p className="text-light text-sm font-medium mb-1">
                                    {Math.abs(analysis.imbalance) > 10 ? 'Attention Needed' : 'Good Progress'}
                                </p>
                                <p className="text-quaternary text-sm">
                                    Your <strong>{analysis.strongerSide} side</strong> is {Math.abs(analysis.imbalance)}% stronger.
                                    {Math.abs(analysis.imbalance) > 10 &&
                                        ' Consider starting sets with your weaker side and incorporating unilateral assistance work.'
                                    }
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    )
}

const Analysis = () => {
    const [analysis, setAnalysis] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { user } = useAuthContext()

    useEffect(() => {
        const fetchAnalysis = async () => {
            if (!user) return

            try {
                const response = await fetch('/api/workouts/analysis/imbalance', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                })

                const json = await response.json()

                if (response.ok) {
                    setAnalysis(json)
                }
            } catch (error) {
                console.error('Error fetching analysis:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchAnalysis()
    }, [user])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-tertiary border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <p className="text-quaternary">Analyzing your workout data...</p>
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
                    className="text-center mb-12"
                >
                    <div className="w-20 h-20 bg-gradient-to-br from-tertiary to-quaternary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                        <TrendingUp className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-light mb-4">
                        Muscle Imbalance Analysis
                    </h1>
                    <p className="text-quaternary text-lg max-w-2xl mx-auto">
                        Track strength differences between your left and right sides to optimize training and prevent injuries.
                    </p>
                </motion.div>

                {analysis.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="card text-center py-16 max-w-2xl mx-auto"
                    >
                        <div className="w-24 h-24 bg-tertiary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Activity className="w-12 h-12 text-tertiary" />
                        </div>
                        <h3 className="text-2xl font-bold text-light mb-3">
                            No Unilateral Data Yet
                        </h3>
                        <p className="text-quaternary mb-6 max-w-md mx-auto">
                            Log some single-arm or single-leg exercises to see detailed muscle imbalance analysis and recommendations.
                        </p>
                        <div className="text-sm text-quaternary bg-primary/20 p-4 rounded-xl">
                            <strong>Tip:</strong> Try exercises like single-arm dumbbell press, Bulgarian split squats, or single-leg RDLs.
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {analysis.map((item, index) => (
                            <AnalysisCard key={index} analysis={item} index={index} />
                        ))}
                    </div>
                )}

                {/* Summary Stats */}
                {analysis.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        <div className="card text-center">
                            <div className="text-2xl font-bold text-tertiary mb-2">
                                {analysis.length}
                            </div>
                            <div className="text-quaternary">Exercises Analyzed</div>
                        </div>
                        <div className="card text-center">
                            <div className="text-2xl font-bold text-green-400 mb-2">
                                {analysis.filter(a => Math.abs(a.imbalance) <= 5).length}
                            </div>
                            <div className="text-quaternary">Balanced Exercises</div>
                        </div>
                        <div className="card text-center">
                            <div className="text-2xl font-bold text-yellow-400 mb-2">
                                {analysis.filter(a => Math.abs(a.imbalance) > 5 && Math.abs(a.imbalance) <= 10).length}
                            </div>
                            <div className="text-quaternary">Needs Attention</div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default Analysis