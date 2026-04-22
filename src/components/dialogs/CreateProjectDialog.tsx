import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
} from '@mui/material';

export type CreateProjectRequest = {
    code: string;
    name: string;
    status: string;
    description: string;
    objective: string;
    startDate: string | null;
    endDate: string | null;
};

type CreateProjectDialogProps = {
    open: boolean;
    formData: CreateProjectRequest;
    createLoading: boolean;
    onClose: () => void;
    onSubmit: () => void;
    onChange: (
        field: keyof CreateProjectRequest
    ) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export default function CreateProjectDialog({
                                               open,
                                               formData,
                                               createLoading,
                                               onClose,
                                               onSubmit,
                                               onChange,
                                           }: CreateProjectDialogProps) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle sx={{color: 'text.primary'}}>Add new project</DialogTitle>

            <DialogContent>
                <Stack spacing={2} sx={{mt: 1}}>
                    <TextField
                        label="Code"
                        value={formData.code}
                        onChange={onChange('code')}
                        fullWidth
                        required
                    />

                    <TextField
                        label="Name"
                        value={formData.name}
                        onChange={onChange('name')}
                        fullWidth
                        required
                    />

                    <TextField
                        label="Status"
                        value={formData.status}
                        onChange={onChange('status')}
                        fullWidth
                    />

                    <TextField
                        label="Description"
                        value={formData.description}
                        onChange={onChange('description')}
                        fullWidth
                        multiline
                        minRows={3}
                    />

                    <TextField
                        label="Objective"
                        value={formData.objective}
                        onChange={onChange('objective')}
                        fullWidth
                        multiline
                        minRows={3}
                    />

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                            label="Start date"
                            type="date"
                            value={formData.startDate ?? ''}
                            onChange={onChange('startDate')}
                            fullWidth
                            slotProps={{
                                inputLabel: { shrink: true },
                            }}
                        />

                        <TextField
                            label="End date"
                            type="date"
                            value={formData.endDate ?? ''}
                            onChange={onChange('endDate')}
                            fullWidth
                            slotProps={{
                                inputLabel: { shrink: true },
                            }}
                        />
                    </Stack>
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={createLoading}>
                    Cancel
                </Button>
                <Button
                    onClick={onSubmit}
                    variant="contained"
                    disabled={createLoading || !formData.code || !formData.name}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
}