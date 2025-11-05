import { createContext, useContext, useReducer } from 'react'

// Create the context
export const WorkoutsContext = createContext()

// Reducer function
export const workoutReducer = (state, action) => {
    switch (action.type) {
        case 'SET_WORKOUTS':
            return { workouts: action.payload }
        case 'CREATE_WORKOUT':
            return { workouts: [action.payload, ...state.workouts] }
        case 'DELETE_WORKOUT':
            return { workouts: state.workouts.filter((workout) => workout._id !== action.payload._id) }
        case 'UPDATE_WORKOUT':
            return {
                workouts: state.workouts.map((workout) =>
                    workout._id === action.payload._id ? action.payload : workout
                )
            }
        default:
            return state
    }
}

// Provider component
export const WorkoutsProvider = ({ children }) => {
    const [state, dispatch] = useReducer(workoutReducer, {
        workouts: null
    })

    return (
        <WorkoutsContext.Provider value={{ ...state, dispatch }}>
            { children }
        </WorkoutsContext.Provider>
    )
}

// Custom hook
export const useWorkoutsContext = () => {
    const context = useContext(WorkoutsContext)
    if (!context) {
        throw new Error('useWorkoutsContext must be used inside a WorkoutsProvider')
    }
    return context
}