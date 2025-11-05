// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'
import { useLogout } from '../hooks/useLogout'
import { motion } from 'framer-motion'
import { Dumbbell, User, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

const Navbar = () => {
    const { user } = useAuthContext()
    const { logout } = useLogout()
    const location = useLocation()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleLogout = () => {
        logout()
        setIsMobileMenuOpen(false)
    }

    const isActive = (path) => location.pathname === path

    const navItems = user ? [
        { path: '/home', label: 'Workouts' },
        { path: '/analysis', label: 'Analysis' }
    ] : []

    return (
        <nav className="bg-secondary/95 backdrop-blur-md border-b border-quaternary/20 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link
                            to={user ? '/home' : '/'}
                            className="flex items-center space-x-3 group"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="w-10 h-10 bg-gradient-to-br from-tertiary to-quaternary rounded-xl flex items-center justify-center shadow-lg"
                            >
                                <Dumbbell className="w-5 h-5 text-white" />
                            </motion.div>
                            <span className="text-light font-black text-xl tracking-tight">
                GainStack
              </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {user ? (
                            <>
                                {navItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`relative px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                            isActive(item.path)
                                                ? 'text-white'
                                                : 'text-quaternary hover:text-light'
                                        }`}
                                    >
                                        {item.label}
                                        {isActive(item.path) && (
                                            <motion.div
                                                layoutId="navbar-active"
                                                className="absolute inset-0 bg-tertiary/20 rounded-lg -z-10"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                    </Link>
                                ))}

                                <div className="flex items-center space-x-4 pl-4 border-l border-quaternary/20">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-tertiary rounded-full flex items-center justify-center">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-quaternary text-sm font-medium">
                      {user.email.split('@')[0]}
                    </span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-2 bg-tertiary hover:bg-quaternary text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="text-quaternary hover:text-light transition-colors font-semibold hover:scale-105 transition-transform"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-gradient-to-r from-tertiary to-quaternary text-white font-bold py-2 px-6 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-quaternary hover:text-light transition-colors p-2"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-quaternary/20"
                    >
                        <div className="py-4 space-y-4">
                            {user ? (
                                <>
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                                                isActive(item.path)
                                                    ? 'text-white bg-tertiary/20'
                                                    : 'text-quaternary hover:text-light hover:bg-tertiary/10'
                                            }`}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                    <div className="pt-4 border-t border-quaternary/20">
                                        <div className="px-3 py-2 text-quaternary text-sm">
                                            {user.email}
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center justify-center space-x-2 bg-tertiary hover:bg-quaternary text-white font-semibold py-2 px-4 rounded-lg transition-colors mt-2"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-3">
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block w-full text-center text-quaternary hover:text-light transition-colors font-semibold py-3"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block w-full text-center bg-gradient-to-r from-tertiary to-quaternary text-white font-bold py-3 rounded-lg transition-all duration-200"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </nav>
    )
}

export default Navbar