import React, { useEffect, useMemo, useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

interface PageHeaderProps {
    onLogout: () => void;
    expiryTime: number | null; // timestamp in ms
}

const PageHeader: React.FC<PageHeaderProps> = ({ onLogout, expiryTime }) => {
    const calculateTimeLeft = () => {
        if (!expiryTime) return 0;
        return Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
    };

    const [timeLeft, setTimeLeft] = useState<number>(calculateTimeLeft());

    useEffect(() => {
        setTimeLeft(calculateTimeLeft());

        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(interval);
    }, [expiryTime]);

    const formattedTime = useMemo(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }, [timeLeft]);

    return (
        <AppBar position="static" sx={{ backgroundColor: "primary.main" }}>
            <Toolbar sx={{ display: "flex", alignItems: "center" }}>
                {/* Left: session timer */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        minWidth: 140,
                        gap: 1,
                    }}
                >
                    <AccessTimeIcon fontSize="small" />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {formattedTime}
                    </Typography>
                </Box>

                {/* Center: title */}
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        flexGrow: 1,
                        textAlign: "center",
                        fontWeight: "bold",
                    }}
                >
                    Drone Project Manager
                </Typography>

                {/* Right: logout */}
                <Box sx={{ minWidth: 140, display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        color="inherit"
                        onClick={onLogout}
                        sx={{ textTransform: "none" }}
                    >
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default PageHeader;