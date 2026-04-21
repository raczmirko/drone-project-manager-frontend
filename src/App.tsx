import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useState } from 'react';
import SignInSide from './pages/SignIn';
import SignUp from './pages/SignUp';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    const router = createBrowserRouter([
        // Public routes
        { path: '/login', element: <SignInSide isLoggedIn={isLoggedIn} onLogin={handleLogin} /> },
        { path: '/register', element: <SignUp isRegistered={false} onRegister={() => {}} /> },

        // Protected routes
        {
            path: '/projects',
            element: isLoggedIn ? (
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h1>Dashboard</h1>
                    <p>Welcome! You are logged in.</p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <Navigate to="/login" replace /> // replaces the current entry in the history stack
            ),
        },

        // Default redirects
        { path: '/', element: <Navigate to={isLoggedIn ? '/projects' : '/login'} replace /> },
        { path: '*', element: <Navigate to="/" replace /> },
    ]);

    return <RouterProvider router={router} />;
}

export default App;