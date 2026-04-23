import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom';
import {useState} from 'react';
import SignInSide from './pages/SignIn';
import SignUp from './pages/SignUp';
import ProtectedLayout from './layouts/ProtectedLayout.tsx';
import PublicLayout from "./layouts/PublicLayout.tsx";
import Projects from "./pages/Projects.tsx";
import ProjectDetails from "./pages/ProjectDetailsPage.tsx";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
    const [expiryTime, setExpiryTime] = useState<number>(() => {
        const storedExpiry = sessionStorage.getItem('sessionExpiresAt');
        return storedExpiry ? Number(storedExpiry) : 0;
    });

    const handleLogin = () => {
        const storedExpiry = sessionStorage.getItem('sessionExpiresAt');
        setExpiryTime(storedExpiry ? Number(storedExpiry) : 0);
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('sessionExpiresAt');
        if(sessionStorage.getItem('rememberMe') === 'false') {
            localStorage.removeItem('accountNumber');
        }
        setExpiryTime(0);
        setIsLoggedIn(false);
    };

    const router = createBrowserRouter([
        // Public routes
        {
            path: '/',
            element: <PublicLayout/>, // Minimal layout
            children: [
                {path: 'login', element: <SignInSide isLoggedIn={isLoggedIn} onLogin={handleLogin}/>},
                {
                    path: 'register', element: <SignUp onRegister={() => {
                    }} isRegistered={false}/>
                },
                {path: '*', element: <Navigate to={isLoggedIn ? '/projects' : '/login'} replace/>},
            ],
        },
        // Protected routes
        {
            path: '/projects',
            element: isLoggedIn ? (
                <ProtectedLayout isLoggedIn={isLoggedIn} expiryTime={expiryTime} logOut={handleLogout}/>
            ) : (
                <Navigate to="/login" replace/>
            ),
            children: [
                {index: true, element: <Projects/>},
            ],
        },
        {
            path: '/projects/:id',
            element: isLoggedIn ? (
                <ProtectedLayout isLoggedIn={isLoggedIn} expiryTime={expiryTime} logOut={handleLogout}/>
            ) : (
                <Navigate to="/login" replace/>
            ),
            children: [
                {index: true, element: <ProjectDetails/>},
            ],
        },
    ]);

    return <RouterProvider router={router}/>;
}

export default App;