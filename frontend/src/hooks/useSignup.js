import { useState } from 'react'
import { useAuthContext } from '../contexts/AuthContext'

export const useSignup = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()

    const signup = async (email, password) => {
        setIsLoading(true)
        setError(null)

        try {
            console.log('📝 Attempting signup...')
            const response = await fetch('/api/user/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            const text = await response.text()
            console.log('📨 Signup response:', response.status, text)

            if (!response.ok) {
                throw new Error(text ? JSON.parse(text).error : `HTTP ${response.status}`)
            }

            const json = text ? JSON.parse(text) : {}

            // Verify token is present
            if (!json.token) {
                throw new Error('No token received from server')
            }

            console.log('✅ Signup successful, token received')

            // Save user to localStorage
            localStorage.setItem('user', JSON.stringify(json))

            // Update auth context
            dispatch({ type: 'LOGIN', payload: json })

            setIsLoading(false)
            return { success: true }
        } catch (error) {
            console.error('❌ Signup error:', error)
            setIsLoading(false)
            setError(error.message)
            return { success: false }
        }
    }

    return { signup, isLoading, error }
}