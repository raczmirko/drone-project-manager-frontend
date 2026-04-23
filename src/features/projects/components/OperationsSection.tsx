import { useMemo, useState } from 'react';
import { Alert, Box, Button, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
    DataGrid,
    type GridColDef,
    type GridPaginationModel,
} from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import SectionCard from './SectionCard';
import CreateOperationDialog from './CreateOperationDialog';
import type {
    CreateOperationFormValues,
    DroneOperation,
} from '../types/projectTypes';
import { displayValue, formatDate } from '../utils/projectFormatters';

type OperationsSectionProps = {
    projectCode: string;
    rows: DroneOperation[];
    loading: boolean;
    error: string | null;
    rowCount: number;
    paginationModel: GridPaginationModel;
    onPaginationModelChange: (model: GridPaginationModel) => void;
    onCreateOperation: (values: CreateOperationFormValues) => Promise<boolean>;
    createLoading: boolean;
    createError: string | null;
    onResetCreateError: () => void;
};

export default function OperationsSection({
                                              projectCode,
                                              rows,
                                              loading,
                                              error,
                                              rowCount,
                                              paginationModel,
                                              onPaginationModelChange,
                                              onCreateOperation,
                                              createLoading,
                                              createError,
                                              onResetCreateError,
                                          }: OperationsSectionProps) {
    const navigate = useNavigate();
    const [dialogOpen, setDialogOpen] = useState(false);

    const columns = useMemo<GridColDef<DroneOperation>[]>(
        () => [
            {
                field: 'name',
                headerName: 'Name',
                flex: 1.4,
                minWidth: 180,
            },
            {
                field: 'type',
                headerName: 'Type',
                flex: 1,
                minWidth: 140,
                valueGetter: (_value, row) => displayValue(row.type),
            },
            {
                field: 'status',
                headerName: 'Status',
                flex: 1,
                minWidth: 130,
                valueGetter: (_value, row) => displayValue(row.status),
            },
            {
                field: 'date',
                headerName: 'Date',
                flex: 1,
                minWidth: 130,
                valueGetter: (_value, row) => formatDate(row.date),
            },
            {
                field: 'actions',
                headerName: '',
                sortable: false,
                filterable: false,
                width: 80,
                align: 'center',
                headerAlign: 'center',
                renderCell: (params) => (
                    <Tooltip title="Open operation">
                        <IconButton
                            size="small"
                            aria-label="Open operation"
                            onClick={(event) => {
                                event.stopPropagation();
                                navigate(`/projects/${projectCode}/operations/${params.row.id}`);
                            }}
                        >
                            <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                ),
            },
        ],
        [navigate, projectCode],
    );

    return (
        <>
            <SectionCard
                title="Drone operations"
                action={
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setDialogOpen(true)}
                        sx={{ ml: 'auto' }}
                    >
                        Add operation
                    </Button>
                }
            >
                {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

                <Box sx={{ height: 420, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        getRowId={(row) => row.id}
                        loading={loading}
                        pagination
                        paginationMode="server"
                        rowCount={rowCount}
                        pageSizeOptions={[5, 10, 20]}
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
            </SectionCard>

            <CreateOperationDialog
                open={dialogOpen}
                loading={createLoading}
                error={createError}
                onClose={() => setDialogOpen(false)}
                onSubmit={onCreateOperation}
                onResetError={onResetCreateError}
            />
        </>
    );
}
