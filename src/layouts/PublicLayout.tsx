import React from "react";
import { Outlet } from "react-router-dom";
import ParticleBackground from "../components/ParticleBackground";

const PublicLayout: React.FC = () => {
    return (
        <div
            style={{
                minHeight: "100vh",
                position: "relative",
                overflow: "hidden", // Prevent background artifacts
            }}
        >
            {/* Particle Background */}
            <ParticleBackground />

            {/* Main Content */}
            <div
                style={{
                    position: "relative",
                    zIndex: 1, // Ensure this content is on top of the particles
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Outlet />
            </div>
        </div>
    );
};

export default PublicLayout;