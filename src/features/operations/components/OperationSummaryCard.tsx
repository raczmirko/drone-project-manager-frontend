import { useTranslation } from 'react-i18next';
import { Alert, Box, Divider, Paper, Stack, Typography } from '@mui/material';
import SectionCard from '../../projects/components/SectionCard.tsx';
import ReadOnlyField from '../../../components/ReadOnlyField.tsx';
import {formatDate, formatDateTime} from '../../../utils/formatters.ts';
import LocationMapPreview from '../../projects/components/LocationMapPreview.tsx';
import type { DroneOperation } from '../types/operationTypes.ts';

type OperationSummaryCardProps = {
    operation: DroneOperation | null;
    loading: boolean;
    error?: string | null;
};

export default function OperationSummaryCard({
                                                 operation,
                                                 loading,
                                                 error,
                                             }: OperationSummaryCardProps) {
    const { t } = useTranslation();

    return (
        <SectionCard title={t('operations.details.title')}>
            {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

            {loading ? (
                <Typography color="text.secondary">
                    {t('operations.details.loading')}
                </Typography>
            ) : !operation ? (
                <Typography color="text.secondary">
                    {t('operations.details.notFound')}
                </Typography>
            ) : (
                <Stack spacing={3}>
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                        <Stack spacing={2}>
                            <Typography variant="h6">
                                {t('operations.details.mandatorySectionTitle')}
                            </Typography>

                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                <ReadOnlyField
                                    label={t('operations.fields.code')}
                                    value={operation.code}
                                />
                                <ReadOnlyField
                                    label={t('operations.fields.name')}
                                    value={operation.name}
                                />
                            </Stack>

                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                <ReadOnlyField
                                    label={t('operations.fields.date')}
                                    value={formatDate(operation.date)}
                                />
                                <ReadOnlyField
                                    label={t('operations.fields.drone')}
                                    value={operation.drone}
                                />
                            </Stack>

                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                <ReadOnlyField
                                    label={t('general.createdAt')}
                                    value={formatDateTime(operation.createdAt)}
                                />
                                <ReadOnlyField
                                    label={t('general.updatedAt')}
                                    value={formatDateTime(operation.updatedAt)}
                                />
                            </Stack>
                        </Stack>
                    </Paper>

                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                        <Stack spacing={2}>
                            <Typography variant="h6">
                                {t('operations.details.descriptiveSectionTitle')}
                            </Typography>

                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                <ReadOnlyField
                                    label={t('operations.fields.flightMode')}
                                    value={operation.flightMode}
                                />
                                <ReadOnlyField
                                    label={t('operations.fields.kpIndex')}
                                    value={operation.kpIndex?.toString() ?? ''}
                                />
                            </Stack>

                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                <ReadOnlyField
                                    label={t('operations.fields.takeoffTime')}
                                    value={formatDateTime(operation.takeoffTime)}
                                />
                                <ReadOnlyField
                                    label={t('operations.fields.landingTime')}
                                    value={formatDateTime(operation.landingTime)}
                                />
                            </Stack>

                            <ReadOnlyField
                                label={t('operations.fields.weatherDescription')}
                                value={operation.weatherDescription}
                                multiline
                                minRows={2}
                            />

                            <ReadOnlyField
                                label={t('operations.fields.objective')}
                                value={operation.objective}
                                multiline
                                minRows={3}
                            />

                            <ReadOnlyField
                                label={t('operations.fields.description')}
                                value={operation.description}
                                multiline
                                minRows={3}
                            />
                        </Stack>
                    </Paper>

                    <Divider />

                    <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {t('operations.fields.location')}
                        </Typography>

                        <Stack spacing={2}>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                <ReadOnlyField
                                    label={t('operations.fields.location')}
                                    value={operation.location?.name ?? ''}
                                />
                                <ReadOnlyField
                                    label={t('operations.fields.latitude')}
                                    value={operation.location?.latitude ?? ''}
                                />
                                <ReadOnlyField
                                    label={t('operations.fields.longitude')}
                                    value={operation.location?.longitude ?? ''}
                                />
                            </Stack>

                            <LocationMapPreview
                                latitude={operation.location?.latitude ?? ''}
                                longitude={operation.location?.longitude ?? ''}
                                label={t('operations.fields.locationPreview')}
                            />
                        </Stack>
                    </Box>
                </Stack>
            )}
        </SectionCard>
    );
}