import { Link } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import LightRays from '../components/LightRays'

const FeatureCard = ({ icon, title, description }) => (
    <div className="card hover:scale-105 transition-transform duration-300">
        <div className="w-12 h-12 bg-tertiary rounded-lg flex items-center justify-center mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-semibold text-light mb-2">{title}</h3>
        <p className="text-quaternary text-sm">{description}</p>
    </div>
)

const Landing = () => {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Three.js Canvas for Light Rays */}
            <div className="absolute inset-0 z-0">
                <Canvas>
                    <LightRays
                        raysOrigin="top-center-offset"
                        raysColor="#0ea5e9"
                        raysSpeed={0.8}
                        lightSpread={0.8}
                        rayLength={1.2}
                        followMouse={true}
                        mouseInfluence={0.03}
                    />
                </Canvas>
            </div>

            {/* Hero Section */}
            <section className="relative z-10 pt-20 pb-32 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-bold text-light mb-6">
                        Transform Your
                        <span className="block bg-gradient-to-r from-tertiary to-quaternary bg-clip-text text-transparent">
              Fitness Journey
            </span>
                    </h1>
                    <p className="text-xl text-quaternary mb-8 max-w-3xl mx-auto">
                        Track your workouts, analyze your progress, and achieve your fitness goals with intelligent features designed for serious lifters.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/signup" className="btn-primary text-lg px-8 py-4">
                            Start Training Smarter
                        </Link>
                        <Link to="/login" className="btn-secondary text-lg px-8 py-4">
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative z-10 py-20 px-4 bg-secondary/50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-light text-center mb-4">
                        Smart Training Features
                    </h2>
                    <p className="text-quaternary text-center mb-12 max-w-2xl mx-auto">
                        Built with advanced features that make your training more efficient and effective.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            }
                            title="Smart Plate Calculator"
                            description="Instant barbell plate calculations integrated directly into your workout logging. No more mental math during your sets."
                        />

                        <FeatureCard
                            icon={
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                            title="Automatic Rest Timer"
                            description="Context-aware rest timers that automatically start based on your rep ranges. Train smarter, not harder."
                        />

                        <FeatureCard
                            icon={
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            }
                            title="Muscle Imbalance Analysis"
                            description="Track and analyze strength imbalances between left and right sides to prevent injuries and optimize performance."
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-light mb-4">
                        Ready to Elevate Your Training?
                    </h2>
                    <p className="text-quaternary mb-8">
                        Join thousands of lifters who are already training smarter with GainStack.
                    </p>
                    <Link to="/signup" className="btn-primary text-lg px-8 py-4">
                        Get Started Free
                    </Link>
                </div>
            </section>
        </div>
    )
}

export default Landing