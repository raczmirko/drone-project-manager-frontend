import { Alert, Box, Paper, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { OperationFlightPathMapProps } from '../types/operationAnalysisTypes.ts';

const startIcon = L.divIcon({
    html: '<div style="background:#2e7d32;color:white;border-radius:999px;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-weight:700;">S</div>',
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

const endIcon = L.divIcon({
    html: '<div style="background:#d32f2f;color:white;border-radius:999px;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-weight:700;">E</div>',
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

function FitBounds({ positions }: { positions: [number, number][] }) {
    const map = useMap();

    if (positions.length > 1) {
        map.fitBounds(positions, { padding: [32, 32] });
    } else if (positions.length === 1) {
        map.setView(positions[0], 17);
    }

    return null;
}

/**
 * Component for displaying a map of the flight path.
 */
export default function OperationFlightPathMap({
                                                   rows,
                                                   loading = false,
                                                   error = null,
                                               }: OperationFlightPathMapProps) {
    const { t } = useTranslation();

    /**
     * Extract GPS coordinates from the rows and sort them by timestamp.
     */
    const positions = useMemo<[number, number][]>(
        () =>
            rows
                .filter(
                    (row) =>
                        row.gpsLatitude != null &&
                        row.gpsLongitude != null,
                )
                .sort((a, b) => {
                    const aTime = a.capturedAt ? new Date(a.capturedAt).getTime() : 0;
                    const bTime = b.capturedAt ? new Date(b.capturedAt).getTime() : 0;
                    return aTime - bTime;
                })
                .map((row) => [row.gpsLatitude as number, row.gpsLongitude as number]),
        [rows],
    );

    /**
     * Default center position (Budapest) if no GPS coordinates are available.
     */
    const center = positions[0] ?? [47.4979, 19.0402];

    return (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Stack spacing={2}>
                <Typography variant="h6">
                    {t('operations.imageAnalysis.flightPathMap')}
                </Typography>

                {loading ? (
                    <Typography color="text.secondary">
                        {t('general.actions.loading')}
                    </Typography>
                ) : null}

                {error ? <Alert severity="error">{error}</Alert> : null}

                {!loading && !error && positions.length === 0 ? (
                    <Alert severity="info">
                        {t('operations.imageAnalysis.noFlightPath')}
                    </Alert>
                ) : null}

                <Box
                    sx={{
                        width: '100%',
                        height: 420,
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: 1,
                        borderColor: 'divider',
                    }}
                >
                    <MapContainer
                        center={center as [number, number]}
                        zoom={13}
                        style={{ width: '100%', height: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; OpenStreetMap contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {positions.length > 0 ? (
                            <>
                                <Polyline positions={positions} pathOptions={{ color: '#1976d2', weight: 4 }} />
                                <Marker position={positions[0]} icon={startIcon} />
                                <Marker position={positions[positions.length - 1]} icon={endIcon} />
                                <FitBounds positions={positions} />
                            </>
                        ) : null}
                    </MapContainer>
                </Box>
            </Stack>
        </Paper>
    );
}