import { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
} from '@mui/material';
import type { CreateOperationFormValues } from '../types/projectTypes';
import { EMPTY_OPERATION_FORM } from '../hooks/useProjectOperations';

type CreateOperationDialogProps = {
    open: boolean;
    loading: boolean;
    error: string | null;
    onClose: () => void;
    onSubmit: (values: CreateOperationFormValues) => Promise<boolean>;
    onResetError: () => void;
};

export default function CreateOperationDialog({
                                                  open,
                                                  loading,
                                                  error,
                                                  onClose,
                                                  onSubmit,
                                                  onResetError,
                                              }: CreateOperationDialogProps) {
    const [form, setForm] = useState<CreateOperationFormValues>(EMPTY_OPERATION_FORM);

    useEffect(() => {
        if (open) {
            setForm(EMPTY_OPERATION_FORM);
            onResetError();
        }
    }, [open, onResetError]);

    const handleChange =
        (field: keyof CreateOperationFormValues) =>
            (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setForm((previous) => ({
                    ...previous,
                    [field]: event.target.value,
                }));
            };

    const handleSubmit = async () => {
        const success = await onSubmit(form);

        if (success) {
            setForm(EMPTY_OPERATION_FORM);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
            <DialogTitle>Add new operation</DialogTitle>

            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    {error ? <Alert severity="error">{error}</Alert> : null}

                    <TextField
                        label="Name"
                        value={form.name}
                        onChange={handleChange('name')}
                        fullWidth
                        required
                    />

                    <TextField
                        label="Type"
                        value={form.type}
                        onChange={handleChange('type')}
                        fullWidth
                    />

                    <TextField
                        label="Status"
                        value={form.status}
                        onChange={handleChange('status')}
                        fullWidth
                    />

                    <TextField
                        label="Date"
                        type="date"
                        value={form.date}
                        onChange={handleChange('date')}
                        fullWidth
                        slotProps={{
                            inputLabel: { shrink: true },
                        }}
                    />
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading || !form.name.trim()}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
}
