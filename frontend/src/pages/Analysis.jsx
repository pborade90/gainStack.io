import { useEffect, useState } from 'react'
import { useAuthContext } from '../contexts/AuthContext'  // Fixed import

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
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tertiary"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-light mb-2">Muscle Imbalance Analysis</h1>
                <p className="text-quaternary">
                    Track strength differences between your left and right sides to optimize your training and prevent injuries.
                </p>
            </div>

            {analysis.length === 0 ? (
                <div className="card text-center py-12">
                    <svg className="w-16 h-16 text-quaternary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-light mb-2">No unilateral data yet</h3>
                    <p className="text-quaternary">
                        Log some unilateral exercises (single-arm or single-leg) to see imbalance analysis.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {analysis.map((item, index) => (
                        <div key={index} className="card">
                            <h3 className="text-lg font-semibold text-light mb-4">{item.exercise}</h3>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="text-center">
                                        <div className="text-sm text-quaternary mb-1">Left Side</div>
                                        <div className="text-light font-bold text-xl">
                                            {item.leftAvg} kg·reps
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-sm text-quaternary mb-1">Right Side</div>
                                        <div className="text-light font-bold text-xl">
                                            {item.rightAvg} kg·reps
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-primary rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-quaternary">Imbalance</span>
                                        <span className={`text-sm font-semibold ${
                                            Math.abs(item.imbalance) > 10 ? 'text-red-400' :
                                                Math.abs(item.imbalance) > 5 ? 'text-yellow-400' : 'text-green-400'
                                        }`}>
                      {Math.abs(item.imbalance)}%
                    </span>
                                    </div>

                                    <div className="w-full bg-secondary rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full bg-gradient-to-r from-tertiary to-quaternary"
                                            style={{
                                                width: '100%',
                                                transform: item.strongerSide === 'left' ? 'none' : 'scaleX(-1)'
                                            }}
                                        ></div>
                                    </div>

                                    <div className="flex justify-between text-xs text-quaternary mt-1">
                                        <span>Left</span>
                                        <span>Right</span>
                                    </div>
                                </div>

                                {Math.abs(item.imbalance) > 5 && (
                                    <div className={`p-3 rounded-lg text-sm ${
                                        Math.abs(item.imbalance) > 10 ? 'bg-red-500/10 border border-red-500/20' :
                                            'bg-yellow-500/10 border border-yellow-500/20'
                                    }`}>
                                        <p className="text-light">
                                            Your <strong>{item.strongerSide} side</strong> is {Math.abs(item.imbalance)}% stronger.
                                            {Math.abs(item.imbalance) > 10 && ' Consider starting your next set with your weaker side.'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Analysis