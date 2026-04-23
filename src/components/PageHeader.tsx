import React, {useEffect, useMemo, useState} from "react";
import {AppBar, Box, Breadcrumbs, Button, Link, Toolbar, Typography} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {Link as RouterLink, useLocation} from "react-router-dom";

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

    // Breadcrumbs logic
    const location = useLocation();

    const breadcrumbs = useMemo(() => {
        const pathnames = location.pathname.split('/').filter(Boolean);

        return [
            { label: 'ProjectsPage', to: '/projects' },
            ...pathnames.slice(1).map((segment, index) => {
                const to = `/${pathnames.slice(0, index + 2).join('/')}`;
                return { label: segment, to };
            }),
        ];
    }, [location.pathname]);

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

                {/* Center: title & breadcrumbs*/}
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

                <Box sx={{ flexGrow: 1, textAlign: "center" }}>
                    <Breadcrumbs
                        aria-label="breadcrumb"
                        separator="›"
                        sx={{ justifyContent: "center", display: "flex" }}
                    >
                        {breadcrumbs.map((crumb, idx) => (
                            <Link
                                key={crumb.to}
                                component={RouterLink}
                                to={crumb.to}
                                color={idx === breadcrumbs.length - 1 ? "white" : "inherit"}
                                underline={idx === breadcrumbs.length - 1 ? "none" : "hover"}
                                sx={{ fontWeight: idx === breadcrumbs.length - 1 ? "bold" : "normal" }}
                            >
                                {crumb.label}
                            </Link>
                        ))}
                    </Breadcrumbs>
                </Box>

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