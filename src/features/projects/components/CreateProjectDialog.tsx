import React from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

export type CreateProjectRequest = {
    code: string;
    name: string;
    status: string;
    description: string;
    objective: string;
    startDate: string | null;
    endDate: string | null;
};

type ProjectTextField = Exclude<
    keyof CreateProjectRequest,
    'startDate' | 'endDate'
>;

type CreateProjectDialogProps = {
    open: boolean;
    formData: CreateProjectRequest;
    createLoading: boolean;
    onClose: () => void;
    onSubmit: () => void;
    onChange: (
        field: ProjectTextField
    ) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onDateChange: (
        field: 'startDate' | 'endDate'
    ) => (value: Dayjs | null) => void;
};

function toDayjs(value: string | null | undefined): Dayjs | null {
    if (!value) {
        return null;
    }

    const parsed = dayjs(value);
    return parsed.isValid() ? parsed : null;
}

export default function CreateProjectDialog({
                                                open,
                                                formData,
                                                createLoading,
                                                onClose,
                                                onSubmit,
                                                onChange,
                                                onDateChange,
                                            }: CreateProjectDialogProps) {
    const { t } = useTranslation();

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ color: 'text.primary' }}>
                {t('projects.create.title')}
            </DialogTitle>

            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label={t('projects.fields.code')}
                        value={formData.code}
                        onChange={onChange('code')}
                        fullWidth
                        required
                    />

                    <TextField
                        label={t('projects.fields.name')}
                        value={formData.name}
                        onChange={onChange('name')}
                        fullWidth
                        required
                    />

                    <TextField
                        label={t('projects.fields.status')}
                        value={formData.status}
                        onChange={onChange('status')}
                        fullWidth
                    />

                    <TextField
                        label={t('projects.fields.description')}
                        value={formData.description}
                        onChange={onChange('description')}
                        fullWidth
                        multiline
                        minRows={3}
                    />

                    <TextField
                        label={t('projects.fields.objective')}
                        value={formData.objective}
                        onChange={onChange('objective')}
                        fullWidth
                        multiline
                        minRows={3}
                    />

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <DatePicker
                            label={t('projects.fields.startDate')}
                            value={toDayjs(formData.startDate)}
                            onChange={onDateChange('startDate')}
                            format="YYYY-MM-DD"
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                },
                            }}
                        />

                        <DatePicker
                            label={t('projects.fields.endDate')}
                            value={toDayjs(formData.endDate)}
                            onChange={onDateChange('endDate')}
                            format="YYYY-MM-DD"
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                },
                            }}
                        />
                    </Stack>
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={createLoading}>
                    {t('general.actions.cancel')}
                </Button>
                <Button
                    onClick={onSubmit}
                    variant="contained"
                    disabled={createLoading || !formData.code || !formData.name}
                >
                    {t('general.actions.create')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}