import React from 'react';
import {Box} from '@mui/material';
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
            <Box sx={{ display: 'flex', width: '100%' }}>
                <main style={{ flexGrow: 1, padding: '20px', width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
                    <Box sx={{ mt: 8, width: '100%', flexGrow: 1 }}>
                        <Outlet />
                    </Box>
                </main>
            </Box>
        </NotificationProvider>
    );
};

export default ProtectedLayout;
