import { useMemo } from 'react';
import { Alert, Box } from '@mui/material';
import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid';
import type { OperationImageMetadataRow } from '../types/operationImageMetadataTypes.ts';
import {formatDateTime, formatFileSize} from '../../../utils/formatters.ts';
import {useTranslation} from "react-i18next";

type OperationImageMetadataGridProps = {
    rows: OperationImageMetadataRow[];
    loading: boolean;
    error: string | null;
    rowCount: number;
    paginationModel: GridPaginationModel;
    onPaginationModelChange: (model: GridPaginationModel) => void;
};

/**
 * DataGrid component for displaying image metadata.
 */
export default function OperationImageMetadataGrid({
                                                       rows,
                                                       loading,
                                                       error,
                                                       rowCount,
                                                       paginationModel,
                                                       onPaginationModelChange,
                                                   }: OperationImageMetadataGridProps) {
    const { t } = useTranslation();
    const columns = useMemo<GridColDef<OperationImageMetadataRow>[]>(
        () => [
            {
                field: 'originalFilename',
                headerName: t("operations.metadata.filename"),
                flex: 1.6,
                minWidth: 240,
            },
            {
                field: 'capturedAt',
                headerName: t("operations.metadata.capturedAt"),
                flex: 1.1,
                minWidth: 180,
                valueGetter: (_value, row) => formatDateTime(row.capturedAt),
            },
            {
                field: 'fileSizeBytes',
                headerName: t("operations.metadata.size"),
                flex: 0.8,
                minWidth: 120,
                valueGetter: (_value, row) => formatFileSize(row.fileSizeBytes),
            },
            {
                field: 'dimensions',
                headerName: t("operations.metadata.size"),
                flex: 0.9,
                minWidth: 140,
                valueGetter: (_value, row) =>
                    row.imageWidth && row.imageHeight ? `${row.imageWidth} × ${row.imageHeight}` : '',
            },
            {
                field: 'gps',
                headerName: t("operations.metadata.gps"),
                flex: 1.2,
                minWidth: 220,
                valueGetter: (_value, row) =>
                    row.gpsLatitude != null && row.gpsLongitude != null
                        ? `${row.gpsLatitude.toFixed(6)}, ${row.gpsLongitude.toFixed(6)}`
                        : '',
            },
            {
                field: 'gpsAltitude',
                headerName: t("operations.metadata.altitude"),
                flex: 0.8,
                minWidth: 120,
                valueGetter: (_value, row) =>
                    row.gpsAltitude != null ? `${row.gpsAltitude.toFixed(2)} m` : '',
            },
            {
                field: 'camera',
                headerName: t("operations.metadata.camera"),
                flex: 1.1,
                minWidth: 180,
                valueGetter: (_value, row) =>
                    [row.cameraMake, row.cameraModel].filter(Boolean).join(' '),
            },
            {
                field: 'metadataStatus',
                headerName: t("operations.status.size"),
                flex: 0.8,
                minWidth: 120,
            },
        ],
        [],
    );

    return (
        <Box>
            {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

            <DataGrid
                autoHeight
                rows={rows}
                columns={columns}
                getRowId={(row) => row.id}
                loading={loading}
                pagination
                paginationMode="server"
                rowCount={rowCount}
                pageSizeOptions={[10, 25, 50, 100]}
                paginationModel={paginationModel}
                onPaginationModelChange={onPaginationModelChange}
                disableRowSelectionOnClick
                sx={{
                    border: 0,
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: 'grey.100',
                    },
                }}
            />
        </Box>
    );
}