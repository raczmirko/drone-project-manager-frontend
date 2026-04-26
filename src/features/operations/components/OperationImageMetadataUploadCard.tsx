import React from 'react';
import { Alert, Button, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import type { OperationImageMetadataExtractionResponse } from '../types/operationImageMetadataTypes.ts';
import {useTranslation} from "react-i18next";

type OperationImageMetadataUploadCardProps = {
    loading: boolean;
    error: string | null;
    uploadResult: OperationImageMetadataExtractionResponse | null;
    onUpload: (files: File[]) => Promise<void>;
};

/**
 * Card for uploading images and extracting metadata from them.
 */
export default function OperationImageMetadataUploadCard({
                                                             loading,
                                                             error,
                                                             uploadResult,
                                                             onUpload,
                                                         }: OperationImageMetadataUploadCardProps) {
    const { t } = useTranslation();
    const inputId = React.useId();
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        setSelectedFiles(files);
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            return;
        }

        await onUpload(selectedFiles);
        setSelectedFiles([]);
    };

    const totalSizeBytes = selectedFiles.reduce((sum, file) => sum + file.size, 0);

    return (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Stack spacing={2}>
                <Typography variant="h6">
                    {t("operations.imageAnalysis.fileUploadTitle")}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    {t("operations.imageAnalysis.fileUploadInfo")}
                </Typography>

                {error ? <Alert severity="error">{error}</Alert> : null}

                {uploadResult ? (
                    <Alert severity="success">
                        Processed: {uploadResult.processedCount}, extracted: {uploadResult.extractedCount}, errors: {uploadResult.errorCount}
                    </Alert>
                ) : null}

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <input
                        id={inputId}
                        hidden
                        multiple
                        type="file"
                        accept="image/*,.jpg,.jpeg,.png,.tif,.tiff,.webp"
                        onChange={handleFileChange}
                    />

                    <Button
                        component="label"
                        htmlFor={inputId}
                        variant="outlined"
                        startIcon={<UploadFileOutlinedIcon />}
                        disabled={loading}
                    >
                        Browse images
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleUpload}
                        disabled={loading || selectedFiles.length === 0}
                    >
                        Extract metadata
                    </Button>
                </Stack>

                <Typography variant="body2" color="text.secondary">
                    Selected files: {selectedFiles.length} | Total size: {(totalSizeBytes / 1024 / 1024).toFixed(2)} MB
                </Typography>

                {loading ? <LinearProgress /> : null}
            </Stack>
        </Paper>
    );
}