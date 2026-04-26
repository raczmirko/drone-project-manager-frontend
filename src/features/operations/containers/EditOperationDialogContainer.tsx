import { useMemo, useState } from 'react';
import { Button } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useTranslation } from 'react-i18next';
import CreateOperationStepperDialog from '../components/CreateOperationStepperDialog.tsx';
import type {
    CreateLocationFormValues,
    CreateOperationWizardSubmitValues,
    LocationOption,
} from '../types/operationWizardTypes.ts';
import type {
    DroneOperation,
    UpdateDroneOperationRequest,
} from '../types/operationTypes.ts';
import {
    toOperationWizardInitialValues,
    toUpdateDroneOperationRequest,
} from '../utils/operationPayloadMappers.ts';

type EditOperationDialogContainerProps = {
    operation: DroneOperation;
    availableLocations: LocationOption[];
    locationsLoading: boolean;
    locationsError: string | null;
    onCreateLocation: (values: CreateLocationFormValues) => Promise<LocationOption | null>;
    locationCreateLoading: boolean;
    locationCreateError: string | null;
    onResetLocationCreateError: () => void;
    onUpdateOperation: (
        operationCode: string,
        payload: UpdateDroneOperationRequest,
    ) => Promise<boolean>;
    updateLoading: boolean;
    updateError: string | null;
    onResetUpdateError: () => void;
};

export default function EditOperationDialogContainer({
                                                         operation,
                                                         availableLocations,
                                                         locationsLoading,
                                                         locationsError,
                                                         onCreateLocation,
                                                         locationCreateLoading,
                                                         locationCreateError,
                                                         onResetLocationCreateError,
                                                         onUpdateOperation,
                                                         updateLoading,
                                                         updateError,
                                                         onResetUpdateError,
                                                     }: EditOperationDialogContainerProps) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const initialValues = useMemo(
        () => toOperationWizardInitialValues(operation),
        [operation],
    );

    const handleResetErrors = () => {
        onResetUpdateError();
        onResetLocationCreateError();
    };

    const handleSubmit = async (
        values: CreateOperationWizardSubmitValues,
    ): Promise<boolean> => {
        handleResetErrors();

        const payload = toUpdateDroneOperationRequest(values);
        return onUpdateOperation(operation.code, payload);
    };

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<EditOutlinedIcon />}
                onClick={() => setOpen(true)}
            >
                {t('general.actions.edit')}
            </Button>

            <CreateOperationStepperDialog
                open={open}
                mode="edit"
                initialValues={initialValues}
                codeReadOnly
                loading={updateLoading}
                error={updateError}
                availableLocations={availableLocations}
                locationsLoading={locationsLoading}
                locationsError={locationsError}
                onCreateLocation={onCreateLocation}
                locationCreateLoading={locationCreateLoading}
                locationCreateError={locationCreateError}
                onResetLocationCreateError={onResetLocationCreateError}
                onClose={() => setOpen(false)}
                onSubmit={handleSubmit}
                onResetError={onResetUpdateError}
            />
        </>
    );
}