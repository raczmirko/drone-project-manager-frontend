import {useState} from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import './App.css';
import SignInSide from './pages/SignIn.tsx';
import SignUp from './pages/SignUp.tsx';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!localStorage.getItem('token'));
    const [isRegistered, setIsRegistered] = useState(false);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    const handleRegister = () => {
        setIsRegistered(true);
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={<SignInSide isLoggedIn={isLoggedIn} onLogin={handleLogin}/>}
                />
                <Route
                    path="/register"
                    element={<SignUp isRegistered={isRegistered} onRegister={handleRegister}/>}
                />
                <Route
                    path="/dashboard"
                    element={
                        isLoggedIn ? (
                            <div style={{padding: '2rem', textAlign: 'center'}}>
                                <h1>Dashboard</h1>
                                <p>Welcome! You are logged in.</p>
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        ) : (
                            <Navigate to="/login"/>
                        )
                    }
                />
                <Route
                    path="/"
                    element={isLoggedIn !== null ? <Navigate to={isLoggedIn ? "/projects" : "/login"}/> : null}
                />
                <Route
                    path="*"
                    element={<Navigate to="/"/>}
                />
            </Routes>
        </Router>
    );
}

export default App;
