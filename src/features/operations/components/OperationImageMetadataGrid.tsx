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
                headerName: t('operations.metadata.filename'),
                flex: 1.6,
                minWidth: 240,
            },
            {
                field: 'mimeType',
                headerName: t('operations.metadata.mimeType'),
                flex: 1,
                minWidth: 160,
            },
            {
                field: 'fileSizeBytes',
                headerName: t('operations.metadata.size'),
                flex: 0.8,
                minWidth: 120,
                valueGetter: (_value, row) => formatFileSize(row.fileSizeBytes),
            },
            {
                field: 'imageWidth',
                headerName: t('operations.metadata.imageWidth'),
                flex: 0.7,
                minWidth: 120,
                valueGetter: (_value, row) => row.imageWidth ?? '',
            },
            {
                field: 'imageHeight',
                headerName: t('operations.metadata.imageHeight'),
                flex: 0.7,
                minWidth: 120,
                valueGetter: (_value, row) => row.imageHeight ?? '',
            },
            {
                field: 'dimensions',
                headerName: t('operations.metadata.dimensions'),
                flex: 0.9,
                minWidth: 140,
                sortable: false,
                filterable: false,
                valueGetter: (_value, row) =>
                    row.imageWidth != null && row.imageHeight != null
                        ? `${row.imageWidth} × ${row.imageHeight}`
                        : '',
            },
            {
                field: 'capturedAt',
                headerName: t('operations.metadata.capturedAt'),
                flex: 1.1,
                minWidth: 180,
                valueGetter: (_value, row) => formatDateTime(row.capturedAt),
            },
            {
                field: 'gpsLatitude',
                headerName: t('operations.metadata.gpsLatitude'),
                flex: 0.9,
                minWidth: 140,
                valueGetter: (_value, row) =>
                    row.gpsLatitude != null ? row.gpsLatitude.toFixed(6) : '',
            },
            {
                field: 'gpsLongitude',
                headerName: t('operations.metadata.gpsLongitude'),
                flex: 0.9,
                minWidth: 140,
                valueGetter: (_value, row) =>
                    row.gpsLongitude != null ? row.gpsLongitude.toFixed(6) : '',
            },
            {
                field: 'gps',
                headerName: t('operations.metadata.gps'),
                flex: 1.2,
                minWidth: 220,
                sortable: false,
                filterable: false,
                valueGetter: (_value, row) =>
                    row.gpsLatitude != null && row.gpsLongitude != null
                        ? `${row.gpsLatitude.toFixed(6)}, ${row.gpsLongitude.toFixed(6)}`
                        : '',
            },
            {
                field: 'gpsAltitude',
                headerName: t('operations.metadata.altitude'),
                flex: 0.8,
                minWidth: 120,
                valueGetter: (_value, row) =>
                    row.gpsAltitude != null ? `${row.gpsAltitude.toFixed(2)} m` : '',
            },
            {
                field: 'cameraMake',
                headerName: t('operations.metadata.cameraMake'),
                flex: 1,
                minWidth: 160,
            },
            {
                field: 'cameraModel',
                headerName: t('operations.metadata.cameraModel'),
                flex: 1,
                minWidth: 160,
            },
            {
                field: 'camera',
                headerName: t('operations.metadata.camera'),
                flex: 1.1,
                minWidth: 180,
                sortable: false,
                filterable: false,
                valueGetter: (_value, row) =>
                    [row.cameraMake, row.cameraModel].filter(Boolean).join(' '),
            },
            {
                field: 'orientation',
                headerName: t('operations.metadata.orientation'),
                flex: 0.7,
                minWidth: 120,
                valueGetter: (_value, row) => row.orientation ?? '',
            },
            {
                field: 'focalLength',
                headerName: t('operations.metadata.focalLength'),
                flex: 0.8,
                minWidth: 130,
                valueGetter: (_value, row) =>
                    row.focalLength != null ? `${row.focalLength.toFixed(2)} mm` : '',
            },
            {
                field: 'isoValue',
                headerName: t('operations.metadata.isoValue'),
                flex: 0.7,
                minWidth: 100,
                valueGetter: (_value, row) => row.isoValue ?? '',
            },
            {
                field: 'aperture',
                headerName: t('operations.metadata.aperture'),
                flex: 0.8,
                minWidth: 120,
                valueGetter: (_value, row) =>
                    row.aperture != null ? `f/${row.aperture.toFixed(1)}` : '',
            },
            {
                field: 'exposureTime',
                headerName: t('operations.metadata.exposureTime'),
                flex: 0.9,
                minWidth: 130,
            },
            {
                field: 'createdAt',
                headerName: t('operations.metadata.createdAt'),
                flex: 1,
                minWidth: 180,
                valueGetter: (_value, row) => formatDateTime(row.createdAt),
            },
        ],
        [t],
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
                showToolbar
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                            mimeType: false,
                            cameraMake: false,
                            cameraModel: false,
                            gpsLatitude: false,
                            gpsLongitude: false,
                            metadataError: false,
                            createdAt: false,
                        },
                    },
                }}
                slotProps={{
                    toolbar: {
                        csvOptions: {
                            fileName: 'operation-image-metadata',
                            utf8WithBom: true,
                            allColumns: true,
                        },
                    },
                }}
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