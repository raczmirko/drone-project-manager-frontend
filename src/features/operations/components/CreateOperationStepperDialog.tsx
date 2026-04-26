import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Stack,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import LocationMapPreview from '../../projects/components/LocationMapPreview.tsx';
import {
    EMPTY_LOCATION_FORM,
    EMPTY_OPERATION_DETAILS_FORM,
    type CreateLocationFormValues,
    type CreateOperationWizardInitialValues,
    type CreateOperationWizardSubmitValues,
    type DroneOperationFormValues,
    type LocationOption,
} from '../types/operationWizardTypes.ts';

type CreateOperationStepperDialogProps = {
    open: boolean;
    loading: boolean;
    error: string | null;
    availableLocations: LocationOption[];
    locationsLoading?: boolean;
    locationsError?: string | null;
    initialValues?: CreateOperationWizardInitialValues;
    mode?: 'create' | 'edit';
    codeReadOnly?: boolean;
    onClose: () => void;
    onSubmit: (values: CreateOperationWizardSubmitValues) => Promise<boolean>;
    onResetError: () => void;
    onCreateLocation?: (values: CreateLocationFormValues) => Promise<LocationOption | null>;
    locationCreateLoading?: boolean;
    locationCreateError?: string | null;
    onResetLocationCreateError?: () => void;
};

function normalizeText(value: unknown): string {
    return String(value ?? '');
}

function trimmedText(value: unknown): string {
    return normalizeText(value).trim();
}

function isOperationStepValid(operation: DroneOperationFormValues): boolean {
    return (
        operation.code.trim().length > 0 &&
        operation.name.trim().length > 0 &&
        operation.date.trim().length > 0 &&
        operation.drone.trim().length > 0
    );
}

export default function CreateOperationStepperDialog({
                                                         open,
                                                         loading,
                                                         error,
                                                         availableLocations,
                                                         locationsLoading = false,
                                                         locationsError = null,
                                                         initialValues,
                                                         mode = 'create',
                                                         codeReadOnly = false,
                                                         onClose,
                                                         onSubmit,
                                                         onResetError,
                                                         onCreateLocation,
                                                         locationCreateLoading = false,
                                                         locationCreateError = null,
                                                         onResetLocationCreateError,
                                                     }: CreateOperationStepperDialogProps) {
    const { t } = useTranslation();

    const [activeStep, setActiveStep] = useState(0);
    const [createLocation, setCreateLocation] =
        useState<CreateLocationFormValues>(EMPTY_LOCATION_FORM);
    const [selectedLocationId, setSelectedLocationId] = useState('');
    const [operation, setOperation] =
        useState<DroneOperationFormValues>(EMPTY_OPERATION_DETAILS_FORM);

    const steps = [
        t('locations.crud.create'),
        t('operations.location.select'),
        t('operations.details.title'),
    ];

    useEffect(() => {
        if (!open) {
            return;
        }

        setActiveStep(0);
        onResetError();
        onResetLocationCreateError?.();

        if (initialValues) {
            setCreateLocation(initialValues.createLocation);
            setSelectedLocationId(initialValues.selectedLocationId ?? '');
            setOperation(initialValues.operation);
            return;
        }

        setCreateLocation(EMPTY_LOCATION_FORM);
        setSelectedLocationId('');
        setOperation(EMPTY_OPERATION_DETAILS_FORM);
    }, [open, initialValues, onResetError, onResetLocationCreateError]);

    const selectedLocation = useMemo(
        () =>
            availableLocations.find((location) => location.id === selectedLocationId) ?? null,
        [availableLocations, selectedLocationId],
    );

    const canCreateLocation =
        Boolean(onCreateLocation) &&
        trimmedText(createLocation.name).length > 0 &&
        trimmedText(createLocation.latitude).length > 0 &&
        trimmedText(createLocation.longitude).length > 0;

    const canContinueFromSelectStep = selectedLocationId.length > 0;
    const canSubmit =
        canContinueFromSelectStep && isOperationStepValid(operation);

    const handleCreateLocationChange =
        (field: keyof CreateLocationFormValues) =>
            (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setCreateLocation((previous) => ({
                    ...previous,
                    [field]: event.target.value,
                }));
            };

    const handleOperationChange =
        (field: keyof DroneOperationFormValues) =>
            (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setOperation((previous) => ({
                    ...previous,
                    [field]: event.target.value,
                }));
            };

    const handleBack = () => {
        setActiveStep((previous) => Math.max(previous - 1, 0));
    };

    const handleSkipCreateLocation = () => {
        onResetLocationCreateError?.();
        setActiveStep(1);
    };

    const handleCreateAndContinue = async () => {
        if (!onCreateLocation || !canCreateLocation) {
            return;
        }

        onResetLocationCreateError?.();

        const createdLocation = await onCreateLocation({
            name: trimmedText(createLocation.name),
            latitude: trimmedText(createLocation.latitude),
            longitude: trimmedText(createLocation.longitude),
        });

        if (!createdLocation) {
            return;
        }

        setSelectedLocationId(createdLocation.id);
        setActiveStep(1);
    };

    const handleContinueFromSelect = () => {
        if (!canContinueFromSelectStep) {
            return;
        }

        setActiveStep(2);
    };

    const handleSubmit = async () => {
        if (!canSubmit) {
            return;
        }

        const success = await onSubmit({
            locationId: selectedLocationId,
            operation,
        });

        if (success) {
            onClose();
        }
    };

    const mapLatitude =
        activeStep === 0
            ? normalizeText(createLocation.latitude)
            : normalizeText(selectedLocation?.latitude);

    const mapLongitude =
        activeStep === 0
            ? normalizeText(createLocation.longitude)
            : normalizeText(selectedLocation?.longitude);

    return (
        <Dialog
            open={open}
            onClose={loading || locationCreateLoading ? undefined : onClose}
            fullWidth
            maxWidth="lg"
            scroll="paper"
        >
            <DialogTitle>
                {mode === 'edit'
                    ? t('operations.crud.edit')
                    : t('operations.crud.create')}
            </DialogTitle>

            <DialogContent dividers>
                <Stack spacing={3}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((step) => (
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {error ? <Alert severity="error">{error}</Alert> : null}
                    {locationsError ? <Alert severity="warning">{locationsError}</Alert> : null}
                    {locationCreateError ? (
                        <Alert severity="error">{locationCreateError}</Alert>
                    ) : null}

                    {activeStep === 0 ? (
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    lg: 'minmax(0, 1.15fr) minmax(360px, 0.85fr)',
                                },
                                gap: 3,
                                alignItems: 'start',
                            }}
                        >
                            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                                <Stack spacing={2}>
                                    <Typography variant="h6">
                                        {t('locations.crud.create')}
                                    </Typography>

                                    <Alert severity="info">
                                        {t('locations.createStepOptional')}
                                    </Alert>

                                    <TextField
                                        label={t('locations.fields.name')}
                                        value={createLocation.name}
                                        onChange={handleCreateLocationChange('name')}
                                        fullWidth
                                    />

                                    <TextField
                                        label={t('locations.fields.longitude')}
                                        value={createLocation.longitude}
                                        onChange={handleCreateLocationChange('longitude')}
                                        fullWidth
                                        placeholder="17.2048"
                                    />

                                    <TextField
                                        label={t('locations.fields.latitude')}
                                        value={createLocation.latitude}
                                        onChange={handleCreateLocationChange('latitude')}
                                        fullWidth
                                        placeholder="46.6248"
                                    />
                                </Stack>
                            </Paper>

                            <LocationMapPreview
                                latitude={mapLatitude}
                                longitude={mapLongitude}
                                label={t('locations.mapPreview')}
                            />
                        </Box>
                    ) : null}

                    {activeStep === 1 ? (
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    lg: 'minmax(0, 1.15fr) minmax(360px, 0.85fr)',
                                },
                                gap: 3,
                                alignItems: 'start',
                            }}
                        >
                            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                                <Stack spacing={2}>
                                    <Typography variant="h6">
                                        {t('operations.location.select')}
                                    </Typography>

                                    {locationsLoading ? (
                                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                            <CircularProgress size={18} />
                                            <Typography variant="body2" color="text.secondary">
                                                {t('general.loading')}
                                            </Typography>
                                        </Stack>
                                    ) : null}

                                    <Autocomplete<LocationOption, false, false, false>
                                        options={availableLocations}
                                        value={selectedLocation}
                                        onChange={(_event, value) =>
                                            setSelectedLocationId(value?.id ?? '')
                                        }
                                        getOptionLabel={(option) => option.name}
                                        isOptionEqualToValue={(option, value) =>
                                            option.id === value.id
                                        }
                                        noOptionsText={t('locations.noOptions')}
                                        renderOption={(props, option) => (
                                            <Box component="li" {...props} key={option.id}>
                                                <Stack spacing={0.25}>
                                                    <Typography variant="body2">
                                                        {option.name}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        {option.latitude}, {option.longitude}
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={t('locations.singular')}
                                                placeholder={t('locations.search')}
                                            />
                                        )}
                                    />

                                    {selectedLocation ? (
                                        <Alert severity="info">
                                            {t('general.actions.selected')}: {selectedLocation.name} (
                                            {selectedLocation.latitude}, {selectedLocation.longitude})
                                        </Alert>
                                    ) : null}
                                </Stack>
                            </Paper>

                            <LocationMapPreview
                                latitude={mapLatitude}
                                longitude={mapLongitude}
                                label={t('locations.mapPreview')}
                            />
                        </Box>
                    ) : null}

                    {activeStep === 2 ? (
                        <Stack spacing={3}>
                            {selectedLocation ? (
                                <Alert severity="info">
                                    {t('general.actions.selected')}: {selectedLocation.name}
                                </Alert>
                            ) : null}

                            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                                <Stack spacing={2}>
                                    <Typography variant="h6">
                                        {t('operations.details.mandatorySectionTitle', 'Mandatory data')}
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                            gap: 2,
                                        }}
                                    >
                                        <TextField
                                            label={t('operations.fields.code')}
                                            value={operation.code}
                                            onChange={handleOperationChange('code')}
                                            fullWidth
                                            required
                                            disabled={codeReadOnly}
                                        />

                                        <TextField
                                            label={t('operations.fields.name')}
                                            value={operation.name}
                                            onChange={handleOperationChange('name')}
                                            fullWidth
                                            required
                                        />

                                        <TextField
                                            label={t('operations.fields.date')}
                                            type="date"
                                            value={operation.date}
                                            onChange={handleOperationChange('date')}
                                            fullWidth
                                            required
                                            slotProps={{ inputLabel: { shrink: true } }}
                                        />

                                        <TextField
                                            label={t('operations.fields.drone')}
                                            value={operation.drone}
                                            onChange={handleOperationChange('drone')}
                                            fullWidth
                                            required
                                        />
                                    </Box>
                                </Stack>
                            </Paper>

                            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                                <Stack spacing={2}>
                                    <Typography variant="h6">
                                        {t('operations.details.descriptiveSectionTitle', 'Descriptive data')}
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                            gap: 2,
                                        }}
                                    >
                                        <TextField
                                            label={t('operations.fields.objective')}
                                            value={operation.objective}
                                            onChange={handleOperationChange('objective')}
                                            fullWidth
                                        />

                                        <TextField
                                            label={t('operations.fields.flightMode')}
                                            value={operation.flightMode}
                                            onChange={handleOperationChange('flightMode')}
                                            fullWidth
                                        />

                                        <TextField
                                            label={t('operations.fields.takeoffTime')}
                                            type="datetime-local"
                                            value={operation.takeoffTime}
                                            onChange={handleOperationChange('takeoffTime')}
                                            fullWidth
                                            slotProps={{ inputLabel: { shrink: true } }}
                                        />

                                        <TextField
                                            label={t('operations.fields.landingTime')}
                                            type="datetime-local"
                                            value={operation.landingTime}
                                            onChange={handleOperationChange('landingTime')}
                                            fullWidth
                                            slotProps={{ inputLabel: { shrink: true } }}
                                        />

                                        <TextField
                                            label={t('operations.fields.weatherDescription')}
                                            value={operation.weatherDescription}
                                            onChange={handleOperationChange('weatherDescription')}
                                            fullWidth
                                            multiline
                                            minRows={3}
                                        />

                                        <TextField
                                            label={t('operations.fields.kpIndex')}
                                            type="number"
                                            value={operation.kpIndex}
                                            onChange={handleOperationChange('kpIndex')}
                                            fullWidth
                                            slotProps={{ htmlInput: { min: 0, step: '0.1' } }}
                                        />

                                        <TextField
                                            label={t('operations.fields.description')}
                                            value={operation.description}
                                            onChange={handleOperationChange('description')}
                                            fullWidth
                                            multiline
                                            minRows={4}
                                            sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}
                                        />
                                    </Box>
                                </Stack>
                            </Paper>
                        </Stack>
                    ) : null}
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} disabled={loading || locationCreateLoading}>
                    {t('general.actions.cancel')}
                </Button>

                {activeStep > 0 ? (
                    <Button onClick={handleBack} disabled={loading || locationCreateLoading}>
                        {t('general.actions.back')}
                    </Button>
                ) : null}

                {activeStep === 0 ? (
                    <>
                        <Button
                            onClick={handleSkipCreateLocation}
                            disabled={loading || locationCreateLoading}
                        >
                            {t('general.actions.skip')}
                        </Button>

                        <Button
                            onClick={handleCreateAndContinue}
                            variant="contained"
                            disabled={!canCreateLocation || locationCreateLoading}
                        >
                            {locationCreateLoading
                                ? t('general.actions.creating')
                                : t('general.actions.createAndUse')}
                        </Button>
                    </>
                ) : null}

                {activeStep === 1 ? (
                    <Button
                        onClick={handleContinueFromSelect}
                        variant="contained"
                        disabled={!canContinueFromSelectStep || loading || locationCreateLoading}
                    >
                        {t('general.actions.continue')}
                    </Button>
                ) : null}

                {activeStep === 2 ? (
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!canSubmit || loading || locationCreateLoading}
                    >
                        {loading
                            ? mode === 'edit'
                                ? t('general.actions.saving')
                                : t('general.actions.creating')
                            : mode === 'edit'
                                ? t('general.actions.save')
                                : t('general.actions.create')}
                    </Button>
                ) : null}
            </DialogActions>
        </Dialog>
    );
}