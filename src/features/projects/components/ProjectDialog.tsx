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
import type { ProjectDialogProps } from '../types/projectTypes.ts';

function toDayjs(value: string | null | undefined): Dayjs | null {
    if (!value) {
        return null;
    }

    const parsed = dayjs(value);
    return parsed.isValid() ? parsed : null;
}

export default function ProjectDialog({
                                          open,
                                          mode,
                                          formData,
                                          loading,
                                          codeReadOnly = false,
                                          onClose,
                                          onSubmit,
                                          onChange,
                                          onDateChange,
                                      }: ProjectDialogProps) {
    const { t } = useTranslation();

    const isEdit = mode === 'edit';

    return (
        <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ color: 'text.primary' }}>
                {isEdit ? t('projects.crud.edit') : t('projects.crud.create')}
            </DialogTitle>

            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label={t('projects.fields.code')}
                        value={formData.code}
                        onChange={onChange('code')}
                        fullWidth
                        required
                        disabled={codeReadOnly}
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
                <Button onClick={onClose} disabled={loading}>
                    {t('general.actions.cancel')}
                </Button>

                <Button
                    onClick={onSubmit}
                    variant="contained"
                    disabled={loading || !formData.code || !formData.name}
                >
                    {loading
                        ? isEdit
                            ? t('general.actions.saving')
                            : t('general.actions.creating')
                        : isEdit
                            ? t('general.actions.save')
                            : t('general.actions.create')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}