import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { WorkoutsProvider } from './contexts/WorkoutContext.jsx'
import { RestTimerProvider } from './contexts/RestTimerContext.jsx'

// Register service worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js');
    });
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <WorkoutsProvider>
                <RestTimerProvider>
                    <App />
                </RestTimerProvider>
            </WorkoutsProvider>
        </AuthProvider>
    </React.StrictMode>,
)