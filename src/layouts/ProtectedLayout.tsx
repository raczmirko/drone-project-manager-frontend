import React from 'react';
import {Outlet} from 'react-router-dom';
import {NotificationProvider} from '../providers/NotificationProvider.tsx';
import PageHeader from "../components/PageHeader.tsx";
import ParticleBackground from "../components/ParticleBackground.tsx";

interface LayoutProps {
    isLoggedIn: boolean;
    expiryTime: number;
    logOut: () => void;
}

const ProtectedLayout: React.FC<LayoutProps> = ({ logOut, expiryTime }) => {
    return (
        <NotificationProvider>
            {/* Particle background */}
            <div style={{
                    position: "relative", // Ensure sibling components respect z-index layering
                    zIndex: -1 // Move other elements on proper layers without hiding particles
                }}
            >
                <ParticleBackground />
            </div>
            {/* PageHeader with Logout */}
            <PageHeader onLogout={logOut} expiryTime={expiryTime}/>
            {/* Main content */}
            <div style={{ display: 'flex' }}>
                <main style={{ flexGrow: 1, padding: '64px 20px 20px 20px' }}>
                    <Outlet />
                </main>
            </div>
        </NotificationProvider>
    );
};

export default ProtectedLayout;
