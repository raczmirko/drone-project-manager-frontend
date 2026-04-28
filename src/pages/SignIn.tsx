import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
    Avatar,
    Box,
    Button,
    Checkbox,
    CssBaseline,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    Link,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Navigate} from "react-router-dom";
import CopyrightTypography from "../components/CopyrightTypography";
import {useNotification} from "../hooks/useNotification";
import {getLoginErrorByStatus} from "../utils/stringUtil";
import TransparentBackgroundTheme from "../layouts/transparentBackgroundTheme.ts";

interface SignInProps {
    onLogin: () => void;
    isLoggedIn: boolean;
}

const SignIn = ({ onLogin, isLoggedIn }: SignInProps) => {
    const { t } = useTranslation();
    const API_BASE_URL =
        (import.meta as unknown as { env: Record<string, string> }).env
            ?.VITE_API_BASE_URL || "http://localhost:8080";

    const [accountNumber, setAccountNumber] = useState(() => localStorage.getItem("accountNumber") || "");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(() => !!localStorage.getItem("accountNumber"));
    const { showNotification } = useNotification();
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    useEffect(() => {
        sessionStorage.setItem("rememberMe", String(rememberMe));
    }, [rememberMe]);

    if (isLoggedIn) {
        return <Navigate to="/projects" />;
    }

    type JwtPayload = {
        exp?: number;
    };

    const getTokenExpiryTime = (token: string): number | null => {
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = atob(base64);
            const decoded: JwtPayload = JSON.parse(jsonPayload);

            return decoded.exp ? decoded.exp * 1000 : null;
        } catch (error) {
            console.error("Failed to decode token:", error);
            return null;
        }
    };

    function toggleRememberMe() {
        setRememberMe((prev) => !prev);
    }

    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        const credentials = {
            accountNumber,
            password,
        };

        fetch(`${API_BASE_URL}/authenticate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        })
            .then((response) => {
                if (!response.ok) {
                    showNotification("error", getLoginErrorByStatus(response.status));
                    throw new Error(t("signIn.loginFailed"));
                }

                const authorizationHeader = response.headers.get("Authorization");
                if (authorizationHeader) {
                    const token = authorizationHeader.split(" ")[1];
                    const expiryTime = getTokenExpiryTime(token);

                    localStorage.setItem("token", token);
                    localStorage.setItem("accountNumber", accountNumber);
                    if (expiryTime) {
                        sessionStorage.setItem("sessionExpiresAt", String(expiryTime));
                    }
                }

                onLogin();
                showNotification("success", t("signIn.successLogin"));
                return;
            })
            .catch((error) => {
                if (error instanceof TypeError) {
                    const errorMessage = t("signIn.networkError");
                    console.error(errorMessage);
                    showNotification("error", errorMessage);
                } else {
                    console.error("Error during login:", error);
                }
            });
    };

    return (
        <ThemeProvider theme={TransparentBackgroundTheme}>
            <Grid
                container
                component="main"
                sx={{
                    minHeight: "100vh",
                    width: "100%",
                }}
            >
                <CssBaseline />
                <Grid
                    size={{ xs: 12, sm: 12, md: 8 }}
                    component={Paper}
                    elevation={12}
                    square={true}
                    sx={{
                        margin: "auto",
                        padding: 4,
                        maxWidth: "500px",
                        backgroundColor: "rgba(255, 255, 255, 0.8)", // Slight opacity with whitened background
                        backdropFilter: "blur(5px)", // Blur effect
                        borderRadius: "16px",
                        textAlign: "center",
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "secondary.main", mx: "auto" }}>
                        <LockOutlinedIcon sx={{color: "white", }} />
                    </Avatar>
                    <Typography component="h1" variant="h5" sx={{ mb: 3, color: "black" }}>
                        {t("signIn.title")}
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                        <TextField
                            fullWidth
                            id="username"
                            label={t("signIn.accountNumber")}
                            name="accountNumber"
                            autoComplete="username"
                            required
                            autoFocus={true}
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            name="password"
                            label={t("signIn.password")}
                            id="password"
                            required
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            value={password}
                            placeholder={t("signIn.passwordPlaceholder")}
                            onChange={(e) => setPassword(e.target.value)}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleClickShowPassword}>
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={rememberMe}
                                    color="primary"
                                    onChange={toggleRememberMe}
                                />
                            }
                            label={t("signIn.rememberMe")}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{
                                py: 1.5,
                            }}
                        >
                            {t("signIn.submit")}
                        </Button>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Link href="/register" variant="body2">
                            {t("signIn.noAccount")}
                        </Link>
                    </Box>
                    <CopyrightTypography sx={{ mt: 4 }} />
                </Grid>
            </Grid>
        </ThemeProvider>
    );
};

export default SignIn;