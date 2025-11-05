// src/pages/Landing.jsx
import { Link } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import LightRays from '../components/LightRays'
import {
    Dumbbell,
    TrendingUp,
    Activity,
    Clock,
    Shield,
    Users
} from 'lucide-react'

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        viewport={{ once: true }}
        className="card group hover:scale-105 transition-all duration-300 border-l-4 border-l-tertiary"
    >
        <div className="w-14 h-14 bg-gradient-to-br from-tertiary to-quaternary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-xl font-bold text-light mb-3">{title}</h3>
        <p className="text-quaternary leading-relaxed">{description}</p>
    </motion.div>
)

const StatCard = ({ number, label }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center"
    >
        <div className="text-3xl md:text-4xl font-bold text-tertiary mb-2">{number}</div>
        <div className="text-quaternary text-sm font-medium">{label}</div>
    </motion.div>
)

const Landing = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-secondary">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <Canvas className="absolute inset-0">
                        <color attach="background" args={['#0D1B2A']} />
                        <LightRays
                            count={80}
                            color="#415A77"
                            speed={0.3}
                            radius={4}
                        />
                        <ambientLight intensity={0.3} />
                        <pointLight position={[10, 10, 10]} intensity={0.5} />
                    </Canvas>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/50 to-primary"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="w-20 h-20 bg-gradient-to-br from-tertiary to-quaternary rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl"
                        >
                            <Dumbbell className="w-10 h-10 text-white" />
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-light mb-6 leading-tight">
                            GAIN
                            <span className="block bg-gradient-to-r from-tertiary to-quaternary bg-clip-text text-transparent">
                STACK
              </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-quaternary mb-8 max-w-3xl mx-auto leading-relaxed">
                            Elevate your fitness journey with intelligent tracking,
                            <span className="text-light font-semibold"> advanced analytics</span>, and
                            <span className="text-light font-semibold"> personalized insights</span>.
                        </p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        >
                            <Link
                                to="/signup"
                                className="group relative bg-gradient-to-r from-tertiary to-quaternary text-white font-bold text-lg px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg shadow-tertiary/25"
                            >
                                <span className="relative z-10">Start Your Journey</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-quaternary to-tertiary rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </Link>
                            <Link
                                to="/login"
                                className="border-2 border-tertiary text-light font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-300 hover:bg-tertiary/10 hover:scale-105"
                            >
                                Sign In
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                >
                    <div className="w-6 h-10 border-2 border-tertiary rounded-full flex justify-center">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-1 h-3 bg-tertiary rounded-full mt-2"
                        />
                    </div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-secondary/50">
                <div className="max-w-6xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        <StatCard number="10K+" label="Active Users" />
                        <StatCard number="500K+" label="Workouts Logged" />
                        <StatCard number="98%" label="Satisfaction Rate" />
                        <StatCard number="24/7" label="Support" />
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-light mb-4">
                            Why Choose GainStack?
                        </h2>
                        <p className="text-quaternary text-xl max-w-2xl mx-auto">
                            Built with cutting-edge features to transform your training experience
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={Activity}
                            title="Smart Analytics"
                            description="Advanced muscle imbalance detection and performance tracking with actionable insights."
                            delay={0}
                        />
                        <FeatureCard
                            icon={Clock}
                            title="Auto Rest Timer"
                            description="Intelligent rest periods based on your workout intensity and goals."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={TrendingUp}
                            title="Progress Tracking"
                            description="Visualize your strength gains and muscle development over time."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={Dumbbell}
                            title="Plate Calculator"
                            description="Instant barbell math with support for multiple bar types and plate combinations."
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={Shield}
                            title="Injury Prevention"
                            description="Identify and correct muscle imbalances before they lead to injuries."
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={Users}
                            title="Community Driven"
                            description="Join a community of dedicated lifters sharing knowledge and motivation."
                            delay={0.5}
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="card bg-gradient-to-br from-tertiary/10 to-quaternary/10 border-tertiary/30"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-light mb-4">
                            Ready to Transform Your Training?
                        </h2>
                        <p className="text-quaternary text-lg mb-8 max-w-2xl mx-auto">
                            Join thousands of athletes who are already achieving their fitness goals with GainStack.
                        </p>
                        <Link
                            to="/signup"
                            className="inline-block bg-gradient-to-r from-tertiary to-quaternary text-white font-bold text-lg px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg shadow-tertiary/25"
                        >
                            Get Started Free
                        </Link>
                        <p className="text-quaternary/70 text-sm mt-4">
                            No credit card required • 30-day free trial
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}

export default Landing