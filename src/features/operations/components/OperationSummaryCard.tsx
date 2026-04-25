import { useTranslation } from 'react-i18next';
import { Alert, Box, Divider, Stack, Typography } from '@mui/material';
import SectionCard from '../../projects/components/SectionCard.tsx';
import ReadOnlyField from '../../../components/ReadOnlyField.tsx';
import { formatDate } from '../../../utils/formatters.ts';
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
                    <Stack spacing={2}>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <ReadOnlyField
                                label={t('operations.fields.code')}
                                value={operation.code}
                            />
                            <ReadOnlyField
                                label={t('operations.fields.name')}
                                value={operation.name}
                            />
                            <ReadOnlyField
                                label={t('operations.fields.date')}
                                value={formatDate(operation.operationDate ?? operation.date)}
                            />
                        </Stack>

                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <ReadOnlyField
                                label={t('operations.fields.drone')}
                                value={operation.drone}
                            />
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
                                value={operation.takeoffTime}
                            />
                            <ReadOnlyField
                                label={t('operations.fields.landingTime')}
                                value={operation.landingTime}
                            />
                            <ReadOnlyField
                                label={t('operations.fields.flightDuration')}
                                value={operation.flightDuration}
                            />
                        </Stack>

                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <ReadOnlyField
                                label={t('operations.fields.flightLength')}
                                value={
                                    operation.flightLength !== null &&
                                    operation.flightLength !== undefined
                                        ? String(operation.flightLength)
                                        : ''
                                }
                            />
                        </Stack>

                        <ReadOnlyField
                            label={t('operations.fields.weatherDescription')}
                            value={operation.weatherDescription}
                            multiline
                            minRows={2}
                        />

                        <ReadOnlyField
                            label={t('operations.fields.description')}
                            value={operation.description}
                            multiline
                            minRows={3}
                        />

                        <ReadOnlyField
                            label={t('operations.fields.objective')}
                            value={operation.objective}
                            multiline
                            minRows={3}
                        />
                    </Stack>

                    <Divider />

                    {/*SEPARATE LOCATION BLOCK*/}
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {t('operations.fields.location')}
                        </Typography>

                        <Stack spacing={2}>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                <ReadOnlyField
                                    label={t('operations.fields.location')}
                                    value={operation.location.name}
                                />
                                <ReadOnlyField
                                    label={t('operations.fields.latitude', 'Latitude')}
                                    value={operation.location.latitude ?? ''}
                                />
                                <ReadOnlyField
                                    label={t('operations.fields.longitude', 'Longitude')}
                                    value={operation.location.longitude ?? ''}
                                />
                            </Stack>

                            <LocationMapPreview
                                latitude={operation.location.latitude}
                                longitude={operation.location.longitude}
                                label={t('operations.fields.locationPreview', 'Location preview')}
                            />
                        </Stack>
                    </Box>
                </Stack>
            )}
        </SectionCard>
    );
}