import { Link, useLocation } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'  // Fixed import
import { useLogout } from '../hooks/useLogout'

const Navbar = () => {
    const { user } = useAuthContext()
    const { logout } = useLogout()
    const location = useLocation()

    const handleLogout = () => {
        logout()
    }

    const isActive = (path) => location.pathname === path

    return (
        <nav className="bg-secondary border-b border-quaternary/20 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to={user ? '/home' : '/'} className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-tertiary to-quaternary rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">GS</span>
                            </div>
                            <span className="text-light font-bold text-xl">GainStack</span>
                        </Link>
                    </div>

                    {user && (
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/home"
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    isActive('/home')
                                        ? 'bg-tertiary text-white'
                                        : 'text-quaternary hover:text-light'
                                }`}
                            >
                                Workouts
                            </Link>
                            <Link
                                to="/analysis"
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    isActive('/analysis')
                                        ? 'bg-tertiary text-white'
                                        : 'text-quaternary hover:text-light'
                                }`}
                            >
                                Analysis
                            </Link>
                            <div className="flex items-center space-x-2">
                <span className="text-quaternary text-sm">
                  {user.email}
                </span>
                                <button
                                    onClick={handleLogout}
                                    className="btn-secondary text-sm"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}

                    {!user && (
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="text-quaternary hover:text-light transition-colors">
                                Login
                            </Link>
                            <Link to="/signup" className="btn-primary">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar