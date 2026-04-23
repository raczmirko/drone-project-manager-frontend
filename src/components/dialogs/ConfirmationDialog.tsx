// src/components/dialogs/ConfirmationDialog.tsx
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

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
                                               title,
                                               message,
                                               onConfirm,
                                               onCancel,
                                               confirmLabel,
                                               cancelLabel,
                                           }: ConfirmationDialogProps) {
    const { t } = useTranslation();

    const displayTitle = title ?? t('general.actions.confirm');
    const displayMessage = message ?? t('general.actions.confirm');
    const displayConfirmLabel = confirmLabel ?? t('general.actions.confirm');
    const displayCancelLabel = cancelLabel ?? t('general.actions.cancel');

    return (
        <Dialog
            open={open}
            onClose={onCancel}
            maxWidth="xs"
            fullWidth
        >
            {displayTitle && (
                <DialogTitle sx={{color: 'text.primary'}}>
                    {displayTitle}
                </DialogTitle>
            )}
            <DialogContent>
                <Typography>
                    {displayMessage}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>
                    {displayCancelLabel}
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="primary"
                >
                    {displayConfirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}