import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface AlertSnackBarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    alertType: 'success' | 'info' | 'warning' | 'error';
    alertText: string;
}

export default function AlertSnackBar({
    isOpen,
    setIsOpen,
    alertType,
    alertText,
}: AlertSnackBarProps) {
    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setIsOpen(false);
    };

    return (
        <Snackbar
            open={isOpen}
            autoHideDuration={5000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert
                onClose={handleClose}
                severity={alertType}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {alertText}
            </Alert>
        </Snackbar>
    );
}
