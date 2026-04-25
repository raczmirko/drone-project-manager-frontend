import {useMemo, useState} from 'react';
import {Alert, Box, Button, IconButton, Tooltip} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {DataGrid, type GridColDef, type GridPaginationModel,} from '@mui/x-data-grid';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import SectionCard from './SectionCard';
import CreateOperationStepperDialog from '../../operations/components/CreateOperationStepperDialog.tsx';
import type {
    CreateLocationFormValues,
    CreateOperationWizardSubmitValues,
    LocationOption,
} from '../../operations/types/operationWizardTypes.ts';
import {formatDate} from '../../../utils/formatters.ts';
import type {CreateDroneOperationRequest, DroneOperation} from "../../operations/types/operationTypes.ts";

type OperationsSectionProps = {
    projectCode: string;
    rows: DroneOperation[];
    loading: boolean;
    error: string | null;
    rowCount: number;
    paginationModel: GridPaginationModel;
    onPaginationModelChange: (model: GridPaginationModel) => void;
    onCreateOperation: (payload: CreateDroneOperationRequest) => Promise<boolean>;
    createLoading: boolean;
    createError: string | null;
    onResetCreateError: () => void;
    availableLocations: LocationOption[];
    locationsLoading: boolean;
    locationsError: string | null;
    onCreateLocation: (values: CreateLocationFormValues) => Promise<LocationOption | null>;
    locationCreateLoading: boolean;
    locationCreateError: string | null;
    onResetLocationCreateError: () => void;
};

function toCreateDroneOperationRequest(
    values: CreateOperationWizardSubmitValues,
    locationId: string,
): CreateDroneOperationRequest {
    return {
        code: values.operation.code.trim(),
        name: values.operation.name.trim(),
        objective: values.operation.objective.trim() || null,
        operationDate: values.operation.operationDate || null,
        description: values.operation.description.trim() || null,
        locationId,
        drone: values.operation.drone.trim() || null,
        flightMode: values.operation.flightMode.trim() || null,
        weatherDescription: values.operation.weatherDescription.trim() || null,
        kpIndex: values.operation.kpIndex ? Number(values.operation.kpIndex) : null,
        takeoffTime: values.operation.takeoffTime || null,
        landingTime: values.operation.landingTime || null,
        flightLength: values.operation.flightLength ? Number(values.operation.flightLength) : null,
        flightDuration: values.operation.flightDuration.trim() || null,
    };
}

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
                                              availableLocations,
                                              locationsLoading,
                                              locationsError,
                                              onCreateLocation,
                                              locationCreateLoading,
                                              locationCreateError,
                                              onResetLocationCreateError,
                                          }: OperationsSectionProps) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [dialogOpen, setDialogOpen] = useState(false);

    const columns = useMemo<GridColDef<DroneOperation>[]>(
        () => [
            {
                field: 'code',
                headerName: t('operations.fields.code'),
                flex: 1.4,
                minWidth: 180,
            },
            {
                field: 'name',
                headerName: t('operations.fields.name'),
                flex: 1.4,
                minWidth: 180,
            },
            {
                field: 'date',
                headerName: t('operations.fields.date'),
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
                    <Tooltip title={t('general.actions.seeDetails')}>
                        <IconButton
                            size="small"
                            aria-label={t('general.actions.seeDetails')}
                            onClick={(event) => {
                                event.stopPropagation();
                                navigate(`/projects/${projectCode}/operations/${params.row.code}`);
                            }}
                        >
                            <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                ),
            },
        ],
        [navigate, projectCode, t],
    );

    const dialogError = createError ?? locationCreateError ?? locationsError ?? null;
    const dialogLoading = createLoading || locationCreateLoading;

    const handleResetDialogErrors = () => {
        onResetCreateError();
        onResetLocationCreateError();
    };

    const handleCreateFromWizard = async (
        values: CreateOperationWizardSubmitValues,
    ): Promise<boolean> => {
        handleResetDialogErrors();

        let locationId: string | null = null;

        if (values.locationMode === 'existing') {
            if ('id' in values.location) {
                locationId = values.location.id;
            }
        } else {
            const createdLocation = await onCreateLocation(values.location as CreateLocationFormValues);
            if (!createdLocation) {
                return false;
            }
            locationId = createdLocation.id;
        }

        if (!locationId) {
            return false;
        }

        const payload = toCreateDroneOperationRequest(values, locationId);
        return onCreateOperation(payload);
    };

    return (
        <>
            <SectionCard
                title={t('operations.title')}
                action={
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setDialogOpen(true)}
                        sx={{ ml: 'auto' }}
                    >
                        {t('operations.crud.add')}
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

            <CreateOperationStepperDialog
                open={dialogOpen}
                loading={dialogLoading}
                error={dialogError}
                availableLocations={availableLocations}
                locationsLoading={locationsLoading}
                locationsError={locationsError}
                onClose={() => setDialogOpen(false)}
                onSubmit={handleCreateFromWizard}
                onResetError={handleResetDialogErrors}
            />
        </>
    );
}
