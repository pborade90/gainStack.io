// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './contexts/AuthContext'
import { WorkoutsProvider } from './contexts/WorkoutContext'
import { RestTimerProvider } from './contexts/RestTimerContext'

// Pages
import Landing from './pages/Landing'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Analysis from './pages/Analysis'

// Components
import Navbar from './components/Navbar'
import RestTimer from './components/RestTimer'

function App() {
    const { user } = useAuthContext()

    return (
        <BrowserRouter>
            <WorkoutsProvider>
                <RestTimerProvider>
                    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary">
                        <Navbar />
                        <main className="pb-20">
                            <Routes>
                                <Route
                                    path="/"
                                    element={!user ? <Landing /> : <Navigate to="/home" />}
                                />
                                <Route
                                    path="/home"
                                    element={user ? <Home /> : <Navigate to="/login" />}
                                />
                                <Route
                                    path="/analysis"
                                    element={user ? <Analysis /> : <Navigate to="/login" />}
                                />
                                <Route
                                    path="/login"
                                    element={!user ? <Login /> : <Navigate to="/home" />}
                                />
                                <Route
                                    path="/signup"
                                    element={!user ? <Signup /> : <Navigate to="/home" />}
                                />
                            </Routes>
                        </main>
                        <RestTimer />
                    </div>
                </RestTimerProvider>
            </WorkoutsProvider>
        </BrowserRouter>
    )
}

export default App