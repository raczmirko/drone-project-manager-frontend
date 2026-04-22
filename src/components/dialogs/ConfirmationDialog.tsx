// src/components/dialogs/ConfirmationDialog.tsx
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Typography,
} from '@mui/material';

type ConfirmationDialogProps = {
    open: boolean;
    title?: string;
    message?: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
};

export default function ConfirmationDialog({
                                               open,
                                               title = 'Confirm',
                                               message = 'Are you sure you want to proceed?',
                                               onConfirm,
                                               onCancel,
                                               confirmLabel = 'Confirm',
                                               cancelLabel = 'Cancel',
                                           }: ConfirmationDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            maxWidth="xs"
            fullWidth
        >
            {title && (
                <DialogTitle sx={{color: 'text.primary'}}>
                    {title}
                </DialogTitle>
            )}
            <DialogContent>
                <Typography>
                    {message}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>
                    {cancelLabel}
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="primary"
                >
                    {confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}