import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSignup } from '../hooks/useSignup'

const Signup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { signup, isLoading, error } = useSignup()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await signup(email, password)
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-tertiary to-quaternary rounded-2xl flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">GS</span>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-light">Create your account</h2>
                    <p className="mt-2 text-quaternary">
                        Or{' '}
                        <Link to="/login" className="font-medium text-tertiary hover:text-quaternary transition-colors">
                            sign in to your existing account
                        </Link>
                    </p>
                </div>

                <form className="card mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-quaternary">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field mt-1"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-quaternary">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field mt-1"
                            placeholder="Choose a strong password"
                        />
                        <p className="mt-1 text-xs text-quaternary">
                            Use at least 8 characters with a mix of letters, numbers & symbols
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500 rounded-lg p-3">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-primary py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Signup