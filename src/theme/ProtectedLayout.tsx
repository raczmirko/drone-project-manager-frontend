import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar.tsx';
import { NotificationProvider } from '../services/NotificationProvider.tsx';
import ParticleBackground from '../components/ParticleBackground.tsx';

interface LayoutProps {
    isLoggedIn: boolean;
    expiryTime: number;
    logOut: () => void;
}

const ProtectedLayout: React.FC<LayoutProps> = ({ logOut }) => {
    return (
        <NotificationProvider>
            <div
                style={{
                    position: "relative", // Ensure sibling components respect z-index layering
                    zIndex: 0 // Move other elements on proper layers without hiding particles
                }}
            >
                <ParticleBackground />
            </div>
            <div style={{ display: 'flex' }}>
                <Sidebar logOut={logOut} />
                <main style={{ flexGrow: 1, padding: '64px 20px 20px 20px' }}>
                    <Outlet />
                </main>
            </div>
        </NotificationProvider>
    );
};

export default ProtectedLayout;
