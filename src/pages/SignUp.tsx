import React, {useState} from "react";
import {
    Alert,
    AlertTitle,
    Avatar,
    Box,
    Button,
    CssBaseline,
    Grid,
    IconButton,
    InputAdornment,
    Link,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {useTranslation} from "react-i18next";
import {Navigate, useNavigate} from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CopyrightTypography from "../components/CopyrightTypography";
import {useNotification} from "../hooks/useNotification";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const defaultTheme = createTheme();

interface SignUpProps {
    onRegister: () => void;
    isRegistered: boolean;
}

const SignUp = ({ onRegister, isRegistered }: SignUpProps) => {
    const { t } = useTranslation();
    const API_BASE_URL =
        (import.meta as unknown as { env: Record<string, string> }).env
            ?.VITE_API_BASE_URL || "http://localhost:8080";
    const navigate = useNavigate(); // Initialize useNavigate hook

    const [accountNumber, setAccountNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { showNotification } = useNotification();

    const [isDialogOpen, setDialogOpen] = useState(false); // Add dialog state

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        if (!accountNumber) {
            showNotification("error", t("signUp.accountNumberRequired"));
            return;
        }

        if (password !== confirmPassword) {
            showNotification("error", t("signUp.passwordsDoNotMatch"));
            return;
        }

        setDialogOpen(true);
    };

    const handleRegister = async () => {
        const userData = { accountNumber, password };

        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/user/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                showNotification(
                    "error",
                    errorData.message || t("signUp.error")
                );
                return;
            }

            showNotification("success", t("signUp.success"));
            onRegister();

            // Redirect to login page on successful registration
            navigate('/login'); // Redirects to login
        } catch (error) {
            console.error("Registration error:", error);
            showNotification("error", t("signUp.error"));
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateAccountNumber = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/user/generate-account-number`, {
                method: "GET",
                headers: {
                    "Content-Type": "text/plain",
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                showNotification(
                    "error",
                    errorData.message || t("signUp.accountNumberGenerationError")
                );
                return;
            }

            const accountNumber = await response.text(); // Extract plain text from response
            setAccountNumber(accountNumber);
        } catch (error) {
            console.error("Registration error:", error);
            showNotification("error", t("signUp.accountNumberGenerationError"));
        }
    }

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(accountNumber).then(() => {
            showNotification("success", t("general.feedback.copiedToClipboard"));
        }).catch(() => {
            showNotification("error", t("general.errors.unexpected"));
        });
    };

    const handleDownload = () => {
        const blob = new Blob([accountNumber], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "account_number.txt"; // Name of the file
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Dialog confirmation logic
    const handleDialogConfirm = () => {
        setDialogOpen(false); // Close the dialog
        handleRegister(); // Proceed with signup
    };

    const handleDialogCancel = () => {
        setDialogOpen(false); // Close the dialog without signing up
    };

    if (isRegistered) {
        return <Navigate to="/login" />;
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid
                container
                component="main"
                sx={{
                    minHeight: "100vh",
                    width: "100%",
                    backgroundImage: "url(https://picsum.photos/2000/2000)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backdropFilter: "blur(8px)",
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
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(5px)",
                        borderRadius: "16px",
                        textAlign: "center",
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "secondary.main", mx: "auto" }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" sx={{ mb: 3, color: "black" }}>
                        {t("signUp.title")}
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                        <Alert
                            severity="info" // Info-specific styling
                            icon={<InfoOutlinedIcon />}
                            sx={{
                                mb: 3,
                                border: "1px solid #2196f3", // Blue outline
                                backgroundColor: "rgba(33, 150, 243, 0.1)", // Light blue background
                                padding: "16px",
                                borderRadius: "8px",
                                textAlign: "left",
                            }}
                        >
                            <AlertTitle sx={{ fontWeight: "bold" }}>{t("signUp.accountNumberInfoHeader")}</AlertTitle>
                            {t("signUp.accountNumberInfo")}
                        </Alert>
                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={accountNumber !== ""}
                            onClick={handleGenerateAccountNumber}
                            sx={{ py: 1.5 }}
                        >
                            {t("signUp.generateAccountNumber")}
                        </Button>
                        <TextField
                            id="accountNumber"
                            label={t("signUp.accountNumber")}
                            value={accountNumber}
                            fullWidth
                            variant="outlined"
                            required
                            slotProps={{
                                input: {
                                    readOnly: true,
                                },
                            }}
                        />
                        {/* COPY ACCOUNT NUMBER BUTTON*/}
                        {/* Render button if accountNumber is not empty */}
                        {accountNumber !== "" && (
                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={accountNumber === ""}
                                onClick={handleCopyToClipboard}
                                sx={{ py: 1.5 }}
                            >
                                {t("general.operations.copy")}
                            </Button>
                        )}
                        {/* DOWNLOAD ACCOUNT NUMBER BUTTON*/}
                        {/* Render button if accountNumber is not empty */}
                        {accountNumber !== "" && (
                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={accountNumber === ""}
                                onClick={handleDownload}
                                sx={{ py: 1.5 }}
                            >
                                {t("general.operations.download")}
                            </Button>
                        )}
                        {/* PASSWORD BUTTON*/}
                        <TextField
                            id="password"
                            label={t("signUp.password")}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type={showPassword ? "text" : "password"}
                            fullWidth
                            required
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
                        {/* PASSWORD AGAIN BUTTON*/}
                        <TextField
                            id="confirmPassword"
                            label={t("signUp.confirmPassword")}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            error={!!confirmPassword && confirmPassword !== password}
                            helperText={
                                confirmPassword && confirmPassword !== password
                                    ? t("signUp.passwordsDoNotMatch")
                                    : ""
                            }
                            type={showPassword ? "text" : "password"}
                            fullWidth
                            required
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
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={isLoading}
                            sx={{ py: 1.5 }}
                        >
                            {isLoading ? t("signUp.submitting") : t("signUp.submit")}
                        </Button>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Link href="/login" variant="body2">
                            {t("signUp.alreadyHaveAccount")}
                        </Link>
                    </Box>
                    <CopyrightTypography sx={{ mt: 4 }} />
                </Grid>
            </Grid>

            {/* Confirmation Dialog */}
            <Dialog open={isDialogOpen} onClose={handleDialogCancel}>
                <DialogTitle>{t("signUp.dialog.title")}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t("signUp.dialog.content")}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant={'contained'} color={'error'} onClick={handleDialogCancel}>{t("signUp.dialog.cancel")}</Button>
                    <Button color={'success'} onClick={handleDialogConfirm} autoFocus>
                        {t("signUp.dialog.confirm")}
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
};

export default SignUp;