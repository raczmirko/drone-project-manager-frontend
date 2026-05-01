import { Alert, Button, Box, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import ReadOnlyField from '../../../components/ReadOnlyField.tsx';
import {formatDateTime, formatDistance, formatDurationSeconds} from '../../../utils/formatters.ts';
import {useTranslation} from "react-i18next";
import type {OperationFlightAnalysisCardProps} from "../types/operationTypes.ts";

/**
 * Card for displaying flight analysis results.
 */
export default function OperationFlightAnalysisCard({
                                                        analysis,
                                                        loading,
                                                        error,
                                                        onAnalyze,
                                                        onPurgeMetadata,
                                                    }: OperationFlightAnalysisCardProps) {
    const { t } = useTranslation();
    return (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Stack spacing={2}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}
                >
                    <Typography variant="h6">
                        {t('operations.imageAnalysis.generatedDashboard')}
                    </Typography>

                    <Stack direction="column" spacing={1}>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={onPurgeMetadata}
                        >
                            {t('operations.imageAnalysis.purgeMetadata')}
                        </Button>

                        <Button
                            variant="contained"
                            onClick={onAnalyze}
                            disabled={loading}
                        >
                            {t('operations.imageAnalysis.updateDashboard')}
                        </Button>
                    </Stack>
                </Stack>

                {loading ? (
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <CircularProgress size={18} />
                        <Typography variant="body2" color="text.secondary">
                            {t("operations.imageAnalysis.generatingDashboard")}
                        </Typography>
                    </Stack>
                ) : null}

                {error ? <Alert severity="error">{error}</Alert> : null}

                {!analysis ? (
                    <Typography color="text.secondary">
                        {t("operations.imageAnalysis.noAnalysis")}
                    </Typography>
                ) : (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                            gap: 2,
                        }}
                    >
                        <ReadOnlyField
                            label={t("operations.imageAnalysis.flightDuration")}
                            value={formatDurationSeconds(analysis.flightDurationSeconds)}
                        />

                        <ReadOnlyField
                            label={t("operations.imageAnalysis.avgRecordingAltitude")}
                            value={analysis.avgRecordingAltitude != null ? `${analysis.avgRecordingAltitude.toFixed(2)} m` : ''}
                        />

                        <ReadOnlyField
                            label={t("operations.imageAnalysis.recordingLength")}
                            value={formatDistance(analysis.recordingLength)}
                        />

                        <ReadOnlyField
                            label={t("operations.imageAnalysis.recordingStart")}
                            value={formatDateTime(analysis.recordingStart)}
                        />

                        <ReadOnlyField
                            label={t("operations.imageAnalysis.recordingEnd")}
                            value={formatDateTime(analysis.recordingEnd)}
                        />

                        <ReadOnlyField
                            label={t("operations.imageAnalysis.numberOfRecordings")}
                            value={String(analysis.numberOfRecordings ?? 0)}
                        />
                    </Box>
                )}
            </Stack>
        </Paper>
    );
}