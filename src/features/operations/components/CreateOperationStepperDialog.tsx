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
    Divider,
    Paper,
    Stack,
    Step,
    StepLabel,
    Stepper,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import LocationMapPreview from '../../projects/components/LocationMapPreview.tsx';
import {
    EMPTY_LOCATION_FORM,
    EMPTY_OPERATION_DETAILS_FORM,
    type CreateLocationFormValues,
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
    initialValues?: CreateOperationWizardSubmitValues;
    mode?: 'create' | 'edit';
    codeReadOnly?: boolean;
    onClose: () => void;
    onSubmit: (values: CreateOperationWizardSubmitValues) => Promise<boolean>;
    onResetError: () => void;
};

function isStepOneValid(
    mode: 'existing' | 'new',
    selectedLocation: LocationOption | null,
    newLocation: CreateLocationFormValues,
) {
    if (mode === 'existing') {
        return selectedLocation != null;
    }

    return (
        newLocation.name.trim().length > 0 &&
        newLocation.latitude.trim().length > 0 &&
        newLocation.longitude.trim().length > 0
    );
}

function isStepTwoValid(operation: DroneOperationFormValues) {
    return operation.code.trim().length > 0 && operation.name.trim().length > 0;
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
                                                     }: CreateOperationStepperDialogProps) {
    const { t } = useTranslation();
    const [activeStep, setActiveStep] = useState(0);
    const [locationMode, setLocationMode] = useState<'existing' | 'new'>('existing');
    const [selectedLocation, setSelectedLocation] = useState<LocationOption | null>(null);
    const [newLocation, setNewLocation] = useState<CreateLocationFormValues>(EMPTY_LOCATION_FORM);
    const [operation, setOperation] = useState<DroneOperationFormValues>(EMPTY_OPERATION_DETAILS_FORM);
    const steps = [t('locations.singular'), t('operations.details.title')];

    useEffect(() => {
        if (!open) {
            return;
        }

        setActiveStep(0);

        if (initialValues) {
            setLocationMode(initialValues.locationMode);
            setOperation(initialValues.operation);

            if (initialValues.locationMode === 'existing' && 'id' in initialValues.location) {
                setSelectedLocation(initialValues.location);
                setNewLocation(EMPTY_LOCATION_FORM);
            } else {
                setSelectedLocation(null);
                setNewLocation(initialValues.location as CreateLocationFormValues);
            }
        } else {
            setLocationMode(availableLocations.length > 0 ? 'existing' : 'new');
            setSelectedLocation(null);
            setNewLocation(EMPTY_LOCATION_FORM);
            setOperation(EMPTY_OPERATION_DETAILS_FORM);
        }

        onResetError();
    }, [open, initialValues, availableLocations.length, onResetError]);

    const currentLatitude = locationMode === 'existing' ? selectedLocation?.latitude : newLocation.latitude;
    const currentLongitude = locationMode === 'existing' ? selectedLocation?.longitude : newLocation.longitude;

    const canContinueFromStepOne = useMemo(
        () => isStepOneValid(locationMode, selectedLocation, newLocation),
        [locationMode, selectedLocation, newLocation],
    );

    const canSubmit = useMemo(
        () => canContinueFromStepOne && isStepTwoValid(operation),
        [canContinueFromStepOne, operation],
    );

    const handleLocationModeChange = (
        _event: React.MouseEvent<HTMLElement>,
        value: 'existing' | 'new' | null,
    ) => {
        if (value) {
            setLocationMode(value);
            onResetError();
        }
    };

    const handleNewLocationChange =
        (field: keyof CreateLocationFormValues) =>
            (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setNewLocation((previous) => ({
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

    const handleNext = () => {
        if (activeStep === 0 && canContinueFromStepOne) {
            setActiveStep(1);
        }
    };

    const handleBack = () => {
        setActiveStep((previous) => Math.max(previous - 1, 0));
    };

    const handleSubmit = async () => {
        if (!canSubmit) {
            return;
        }

        const payload: CreateOperationWizardSubmitValues = {
            locationMode,
            location: locationMode === 'existing' && selectedLocation ? selectedLocation : newLocation,
            operation,
        };

        const success = await onSubmit(payload);

        if (success) {
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            fullWidth
            maxWidth="lg"
            scroll="paper"
        >
            <DialogTitle>
                {mode === 'edit' ? t('operations.crud.edit') : t('operations.crud.create')}
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
                                <Stack spacing={3}>
                                    <Box>
                                        <Typography variant="h6" sx={{ mb: 1 }}>
                                            {t('operations.location.chooseSource')}
                                        </Typography>
                                        <ToggleButtonGroup
                                            value={locationMode}
                                            exclusive
                                            onChange={handleLocationModeChange}
                                            size="small"
                                        >
                                            <ToggleButton
                                                value="existing"
                                                disabled={availableLocations.length === 0}
                                            >
                                                {t('operations.location.existing')}
                                            </ToggleButton>
                                            <ToggleButton value="new">
                                                {t('locations.crud.create')}
                                            </ToggleButton>
                                        </ToggleButtonGroup>
                                    </Box>

                                    <Divider />

                                    {locationMode === 'existing' ? (
                                        <Stack spacing={2}>
                                            <Typography variant="subtitle1">
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
                                                onChange={(_event, value) => setSelectedLocation(value)}
                                                getOptionLabel={(option) => option.name}
                                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                                noOptionsText={t('location.noOptions')}
                                                renderOption={(props, option) => (
                                                    <Box component="li" {...props} key={option.id}>
                                                        <Stack spacing={0.25}>
                                                            <Typography variant="body2">{option.name}</Typography>
                                                            <Typography variant="caption" color="text.secondary">
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
                                    ) : (
                                        <Stack spacing={2}>
                                            <Typography variant="subtitle1">
                                                {t('locations.create')}
                                            </Typography>
                                            <TextField
                                                label={t('locations.fields.name')}
                                                value={newLocation.name}
                                                onChange={handleNewLocationChange('name')}
                                                fullWidth
                                                required
                                            />
                                            <TextField
                                                label={t('locations.fields.longitude')}
                                                value={newLocation.longitude}
                                                onChange={handleNewLocationChange('longitude')}
                                                fullWidth
                                                required
                                                placeholder="17.2048"
                                            />
                                            <TextField
                                                label={t('locations.fields.latitude')}
                                                value={newLocation.latitude}
                                                onChange={handleNewLocationChange('latitude')}
                                                fullWidth
                                                required
                                                placeholder="46.6248"
                                            />
                                        </Stack>
                                    )}
                                </Stack>
                            </Paper>

                            <LocationMapPreview
                                latitude={currentLatitude}
                                longitude={currentLongitude}
                                label={t('locations.mapPreview')}
                            />
                        </Box>
                    ) : (
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
                                label={t('operations.fields.objective')}
                                value={operation.objective}
                                onChange={handleOperationChange('objective')}
                                fullWidth
                            />
                            <TextField
                                label={t('operations.fields.date')}
                                type="date"
                                value={operation.date}
                                onChange={handleOperationChange('date')}
                                fullWidth
                                slotProps={{ inputLabel: { shrink: true } }}
                            />
                            <TextField
                                label={t('operations.fields.drone')}
                                value={operation.drone}
                                onChange={handleOperationChange('drone')}
                                fullWidth
                            />
                            <TextField
                                label={t('operations.fields.flightMode')}
                                value={operation.flightMode}
                                onChange={handleOperationChange('flightMode')}
                                fullWidth
                            />
                            <TextField
                                label={t('operations.fields.weatherDescription')}
                                value={operation.weatherDescription}
                                onChange={handleOperationChange('weatherDescription')}
                                fullWidth
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
                                label={t('operations.fields.flightLength')}
                                type="number"
                                value={operation.flightLength}
                                onChange={handleOperationChange('flightLength')}
                                fullWidth
                                slotProps={{ htmlInput: { min: 0, step: '0.1' } }}
                            />
                            <TextField
                                label={t('operations.fields.flightDuration')}
                                value={operation.flightDurationSeconds}
                                onChange={handleOperationChange('flightDurationSeconds')}
                                fullWidth
                                placeholder="PT35M"
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
                    )}
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} disabled={loading}>
                    {t('general.actions.cancel')}
                </Button>

                {activeStep > 0 ? (
                    <Button onClick={handleBack} disabled={loading}>
                        {t('general.actions.back')}
                    </Button>
                ) : null}

                {activeStep === 0 ? (
                    <Button onClick={handleNext} variant="contained" disabled={!canContinueFromStepOne}>
                        {t('general.actions.continue')}
                    </Button>
                ) : (
                    <Button onClick={handleSubmit} variant="contained" disabled={loading || !canSubmit}>
                        {loading
                            ? mode === 'edit'
                                ? t('general.actions.saving')
                                : t('general.actions.creating')
                            : mode === 'edit'
                                ? t('general.actions.save')
                                : t('general.actions.create')}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
