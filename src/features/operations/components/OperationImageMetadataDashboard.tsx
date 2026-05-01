import { Alert, Box, Paper, Stack, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { useTranslation } from 'react-i18next';
import type { OperationImageMetadataDashboardResponse } from '../types/operationAnalysisTypes.ts';

type OperationImageMetadataDashboardProps = {
    data: OperationImageMetadataDashboardResponse | null;
    loading: boolean;
    error: string | null;
};

const CHART_COLORS = {
    altitudeProfile: '#00897b',
    altitudeDistribution: '#fb8c00',
    distanceAltitude: '#8e24aa',
    groundTrack: '#d81b60',
};

type ChartCardProps = {
    title: string;
    hasData: boolean;
    children: React.ReactNode;
    noDataLabel: string;
};

function ChartCard({ title, hasData, children, noDataLabel }: ChartCardProps) {
    return (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Stack spacing={2}>
                <Typography variant="h6">{title}</Typography>

                {hasData ? (
                    children
                ) : (
                    <Alert severity="info">{noDataLabel}</Alert>
                )}
            </Stack>
        </Paper>
    );
}

export default function OperationImageMetadataDashboard({
                                                            data,
                                                            loading,
                                                            error,
                                                        }: OperationImageMetadataDashboardProps) {
    const { t } = useTranslation();

    if (loading) {
        return <Typography color="text.secondary">{t('general.loading')}</Typography>;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (!data) {
        return (
            <Alert severity="info">
                {t('operations.imageAnalysis.noMetadata')}
            </Alert>
        );
    }

    const altitudeProfile = data.altitudeProfile ?? [];
    const altitudeDistribution = data.altitudeDistribution ?? [];
    const distanceAltitudeProfile = data.distanceAltitudeProfile ?? [];
    const groundTrack = data.groundTrack ?? [];

    const hasAltitudeProfile = altitudeProfile.length > 0;
    const hasAltitudeDistribution = altitudeDistribution.length > 0;
    const hasDistanceAltitudeProfile = distanceAltitudeProfile.length > 0;
    const hasGroundTrack = groundTrack.length > 0;

    const noChartDataLabel = t('operations.imageAnalysis.noMetadata');

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', xl: '1fr 1fr' },
                gap: 3,
            }}
        >
            <ChartCard
                title={t('operations.imageAnalysis.dashboard.altitudeProfile')}
                hasData={hasAltitudeProfile}
                noDataLabel={noChartDataLabel}
            >
                <LineChart
                    height={320}
                    xAxis={[
                        {
                            data: altitudeProfile.map((item) => item.sequence),
                            label: t('operations.imageAnalysis.dashboard.captureOrder'),
                        },
                    ]}
                    series={[
                        {
                            data: altitudeProfile.map((item) => item.altitude),
                            label: t('operations.imageAnalysis.dashboard.altitudeMeters'),
                            color: CHART_COLORS.altitudeProfile,
                            area: true,
                            curve: 'linear',
                        },
                    ]}
                    grid={{ vertical: true, horizontal: true }}
                    margin={{ top: 20, right: 24, bottom: 40, left: 56 }}
                />
            </ChartCard>

            <ChartCard
                title={t('operations.imageAnalysis.dashboard.altitudeDistribution')}
                hasData={hasAltitudeDistribution}
                noDataLabel={noChartDataLabel}
            >
                <BarChart
                    height={320}
                    xAxis={[
                        {
                            scaleType: 'band',
                            data: altitudeDistribution.map((item) => item.bucketLabel),
                        },
                    ]}
                    series={[
                        {
                            data: altitudeDistribution.map((item) => item.count),
                            label: t('operations.imageAnalysis.dashboard.imageCount'),
                            color: CHART_COLORS.altitudeDistribution,
                        },
                    ]}
                    borderRadius={8}
                    grid={{ horizontal: true }}
                    margin={{ top: 20, right: 24, bottom: 40, left: 56 }}
                />
            </ChartCard>

            <ChartCard
                title={t('operations.imageAnalysis.dashboard.distanceAltitude')}
                hasData={hasDistanceAltitudeProfile}
                noDataLabel={noChartDataLabel}
            >
                <LineChart
                    height={320}
                    xAxis={[
                        {
                            data: distanceAltitudeProfile.map((item) => item.distanceMeters),
                            label: t('operations.imageAnalysis.dashboard.distanceMeters'),
                        },
                    ]}
                    series={[
                        {
                            data: distanceAltitudeProfile.map((item) => item.altitude),
                            label: t('operations.imageAnalysis.dashboard.altitudeMeters'),
                            color: CHART_COLORS.distanceAltitude,
                            curve: 'monotoneX',
                        },
                    ]}
                    grid={{ vertical: true, horizontal: true }}
                    margin={{ top: 20, right: 24, bottom: 40, left: 56 }}
                />
            </ChartCard>

            <ChartCard
                title={t('operations.imageAnalysis.dashboard.groundTrack')}
                hasData={hasGroundTrack}
                noDataLabel={noChartDataLabel}
            >
                <ScatterChart
                    height={320}
                    series={[
                        {
                            label: t('operations.imageAnalysis.dashboard.groundTrackPoints'),
                            color: CHART_COLORS.groundTrack,
                            data: groundTrack.map((item) => ({
                                id: item.sequence,
                                x: item.longitude,
                                y: item.latitude,
                            })),
                        },
                    ]}
                    xAxis={[
                        {
                            label: t('operations.metadata.longitude'),
                        },
                    ]}
                    yAxis={[
                        {
                            label: t('operations.metadata.latitude'),
                        },
                    ]}
                    grid={{ vertical: true, horizontal: true }}
                    margin={{ top: 20, right: 24, bottom: 40, left: 56 }}
                />
            </ChartCard>
        </Box>
    );
}