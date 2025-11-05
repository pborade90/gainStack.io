import { useAuthContext } from '../contexts/AuthContext.jsx'  // Fixed import path
import { useWorkoutsContext } from '../contexts/WorkoutContext.jsx'  // Fixed import path

export const useLogout = () => {
    const { dispatch } = useAuthContext()
    const { dispatch: workoutsDispatch } = useWorkoutsContext()

    const logout = () => {
        // Remove user from storage
        localStorage.removeItem('user')

        // Dispatch logout action
        dispatch({ type: 'LOGOUT' })
        workoutsDispatch({ type: 'SET_WORKOUTS', payload: null })
    }

    return { logout }
}