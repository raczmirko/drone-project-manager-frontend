import { Alert, Box, Typography } from '@mui/material';
import {useTranslation} from "react-i18next";

type LocationMapPreviewProps = {
    latitude?: string | null;
    longitude?: string | null;
    label?: string;
};

function isValidCoordinate(value: string | null | undefined): value is string {
    if (!value) {
        return false;
    }

    return !Number.isNaN(Number(value));
}

export default function LocationMapPreview({
                                               latitude,
                                               longitude,
                                               label,
                                           }: LocationMapPreviewProps) {
    const { t } = useTranslation();
    const hasCoordinates = isValidCoordinate(latitude) && isValidCoordinate(longitude);

    if (!hasCoordinates) {
        return (
            <Box
                sx={{
                    height: 100,
                    minHeight: 320,
                    borderRadius: 2,
                    border: (theme) => `1px dashed ${theme.palette.divider}`,
                    bgcolor: 'background.default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3,
                }}
            >
                <Alert severity="info" sx={{ width: '100%' }}>
                    Enter or select valid coordinates to preview the location on the map.
                </Alert>
            </Box>
        );
    }

    const src = `https://maps.google.com/maps?q=${latitude},${longitude}&z=14&output=embed`;

    return (
        <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {label}
            </Typography>
            <Box
                sx={{
                    overflow: 'hidden',
                    borderRadius: 2,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    minHeight: 320,
                    bgcolor: 'grey.100',
                }}
            >
                <Box
                    component="iframe"
                    title={t("locations.selectedPreview")}
                    src={src}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    sx={{
                        width: '100%',
                        height: 320,
                        border: 0,
                        display: 'block',
                    }}
                />
            </Box>
        </Box>
    );
}
