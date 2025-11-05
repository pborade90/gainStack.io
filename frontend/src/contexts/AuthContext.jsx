import { createContext, useContext, useReducer, useEffect } from 'react'

// Create the context
export const AuthContext = createContext()

// Reducer function
const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload }
        case 'LOGOUT':
            return { user: null }
        case 'UPDATE_PROFILE':
            return {
                user: {
                    ...state.user,
                    profile: action.payload
                }
            }
        default:
            return state
    }
}

// Provider component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    })

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user) {
            dispatch({ type: 'LOGIN', payload: user })
        }
    }, [])

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook - only define this once
export const useAuthContext = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider')
    }
    return context
}