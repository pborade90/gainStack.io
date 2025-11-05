import { useState } from 'react'
import { calculatePlates, formatPlateDisplay } from '../utils/plateCalculator'

const PlateCalculator = ({ load }) => {
    const [showCalculator, setShowCalculator] = useState(false)
    const [barWeight, setBarWeight] = useState(20)

    if (!load || load <= 0) return null

    const plates = calculatePlates(load, barWeight)
    const plateDisplay = formatPlateDisplay(plates)

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setShowCalculator(!showCalculator)}
                className="p-2 bg-tertiary hover:bg-quaternary rounded-lg transition-colors"
                title="Show plate calculation"
            >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            </button>

            {showCalculator && (
                <div className="absolute right-0 top-12 z-10 w-64 card animate-fade-in">
                    <div className="flex justify-between items-center mb-3">
                        <h5 className="text-sm font-semibold text-light">Plate Calculator</h5>
                        <button
                            onClick={() => setShowCalculator(false)}
                            className="text-quaternary hover:text-light"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs text-quaternary mb-1">Bar Weight (kg)</label>
                            <select
                                value={barWeight}
                                onChange={(e) => setBarWeight(parseInt(e.target.value))}
                                className="input-field text-sm py-1"
                            >
                                <option value={15}>15kg (Women's Bar)</option>
                                <option value={20}>20kg (Men's Bar)</option>
                                <option value={25}>25kg (Axle Bar)</option>
                            </select>
                        </div>

                        <div className="p-3 bg-primary/50 rounded-lg">
                            <div className="text-xs text-quaternary mb-1">Plates per side:</div>
                            <div className="text-sm font-semibold text-light">
                                {plateDisplay}
                            </div>
                        </div>

                        {plates.length > 0 && (
                            <div className="flex flex-wrap gap-1 justify-center">
                                {[...plates].reverse().map((plate, index) => (
                                    <div
                                        key={index}
                                        className="w-8 h-8 bg-tertiary rounded-full flex items-center justify-center text-xs text-white font-semibold"
                                    >
                                        {plate}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default PlateCalculator