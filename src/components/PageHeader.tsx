import React, { useEffect, useMemo, useState } from "react";
import {
    AppBar,
    Box,
    Breadcrumbs,
    Button,
    Link,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LanguageIcon from "@mui/icons-material/Language";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface PageHeaderProps {
    onLogout: () => void;
    expiryTime: number | null;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onLogout, expiryTime }) => {
    const { t, i18n } = useTranslation();
    const location = useLocation();

    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [languageAnchorEl, setLanguageAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        const getTimeLeft = () => {
            if (!expiryTime) return 0;
            return Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
        };

        setTimeLeft(getTimeLeft());

        const interval = setInterval(() => {
            setTimeLeft(getTimeLeft());
        }, 1000);

        return () => clearInterval(interval);
    }, [expiryTime]);

    const formattedTime = useMemo(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }, [timeLeft]);

    /**
     * Generate breadcrumbs based on the current location.
     */
    const breadcrumbs = useMemo(() => {
        const matchOperationDetails = /^\/projects\/([^/]+)\/operations\/([^/]+)$/.exec(location.pathname);

        if (matchOperationDetails) {
            const projectCode = matchOperationDetails[1];
            const operationCode = matchOperationDetails[2];

            return [
                { label: t('breadcrumbs.projects'), to: '/projects' },
                { label: projectCode, to: `/projects/${projectCode}` },
                { label: operationCode, to: `/projects/${projectCode}/operations/${operationCode}` },
            ];
        }

        const pathnames = location.pathname.split("/").filter(Boolean);

        return [
            { label: t("projects.title"), to: "/projects" },
            ...pathnames.slice(1).map((segment, index) => {
                const to = `/${pathnames.slice(0, index + 2).join("/")}`;
                return {
                    label: decodeURIComponent(segment),
                    to,
                };
            }),
        ];
    }, [location.pathname, t]);

    const languageMenuOpen = Boolean(languageAnchorEl);

    const currentLanguageLabel = i18n.language?.startsWith("hu")
        ? "🇭🇺 HU"
        : "🇬🇧 EN";

    const handleOpenLanguageMenu = (event: React.MouseEvent<HTMLElement>) => {
        setLanguageAnchorEl(event.currentTarget);
    };

    const handleCloseLanguageMenu = () => {
        setLanguageAnchorEl(null);
    };

    const handleChangeLanguage = (lng: "hu" | "en") => {
        void i18n.changeLanguage(lng);
        handleCloseLanguageMenu();
    };

    return (
        <AppBar
            position="sticky"
            elevation={1}
            sx={{
                backgroundColor: "primary.main",
            }}
        >
            {/* Top row */}
            <Toolbar
                sx={{
                    minHeight: 64,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                {/* Left: session timer */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        minWidth: 140,
                        gap: 1,
                        flexShrink: 0,
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
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    Drone Project Manager
                </Typography>

                {/* Right: language + logout */}
                <Box
                    sx={{
                        minWidth: 220,
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: 1,
                        flexShrink: 0,
                    }}
                >
                    <Button
                        color="inherit"
                        onClick={handleOpenLanguageMenu}
                        startIcon={<LanguageIcon />}
                        endIcon={<ArrowDropDownIcon />}
                        sx={{
                            textTransform: "none",
                            minWidth: "auto",
                            px: 1.5,
                            borderColor: "rgba(255,255,255,0.28)",
                        }}
                        variant="outlined"
                    >
                        {currentLanguageLabel}
                    </Button>

                    <Menu
                        anchorEl={languageAnchorEl}
                        open={languageMenuOpen}
                        onClose={handleCloseLanguageMenu}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                    >
                        <MenuItem onClick={() => handleChangeLanguage("hu")}>
                            🇭🇺 Magyar
                        </MenuItem>
                        <MenuItem onClick={() => handleChangeLanguage("en")}>
                            🇬🇧 English
                        </MenuItem>
                    </Menu>

                    <Button
                        color="inherit"
                        onClick={onLogout}
                        sx={{ textTransform: "none" }}
                    >
                        {t("auth.logout")}
                    </Button>
                </Box>
            </Toolbar>

            {/* Bottom row: breadcrumbs */}
            <Box
                sx={{
                    px: 3,
                    py: 0.75,
                    borderTop: "1px solid rgba(255,255,255,0.14)",
                    backgroundColor: "rgba(0,0,0,0.08)",
                }}
            >
                <Breadcrumbs
                    aria-label="breadcrumb"
                    separator="›"
                    sx={{
                        fontSize: "0.875rem",
                        color: "white",
                        "& .MuiBreadcrumbs-ol": {
                            alignItems: "center",
                            flexWrap: "wrap",
                        },
                    }}
                >
                    {breadcrumbs.map((crumb, idx) => {
                        const isLast = idx === breadcrumbs.length - 1;

                        return (
                            <Link
                                key={crumb.to}
                                component={RouterLink}
                                to={crumb.to}
                                underline={isLast ? "none" : "hover"}
                                color={"white"}
                                sx={{
                                    fontWeight: isLast ? 700 : 400,
                                    fontSize: "0.875rem",
                                }}
                            >
                                {crumb.label}
                            </Link>
                        );
                    })}
                </Breadcrumbs>
            </Box>
        </AppBar>
    );
};

export default PageHeader;