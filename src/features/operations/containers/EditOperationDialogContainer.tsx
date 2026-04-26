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
import type { DroneOperation, UpdateDroneOperationRequest } from '../types/operationTypes.ts';
import {
    resolveOperationLocationId,
    toOperationWizardInitialValues, toUpdateDroneOperationRequest
} from "../utils/operationPayloadMappers.ts";


type EditOperationDialogContainerProps = {
    operation: DroneOperation;
    availableLocations: LocationOption[];
    locationsLoading: boolean;
    locationsError: string | null;
    onCreateLocation: (values: CreateLocationFormValues) => Promise<LocationOption | null>;
    locationCreateLoading: boolean;
    locationCreateError: string | null;
    onResetLocationCreateError: () => void;
    onUpdateOperation: (operationCode: string, payload: UpdateDroneOperationRequest) => Promise<boolean>;
    updateLoading: boolean;
    updateError: string | null;
    onResetUpdateError: () => void;
};

/**
 * Renders a dialog for editing an operation.
 */
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

    const dialogError = updateError ?? locationCreateError ?? locationsError ?? null;
    const dialogLoading = updateLoading || locationCreateLoading;

    const handleResetErrors = () => {
        onResetUpdateError();
        onResetLocationCreateError();
    };

    const handleSubmit = async (
        values: CreateOperationWizardSubmitValues,
    ): Promise<boolean> => {
        handleResetErrors();

        const locationId = await resolveOperationLocationId(values, onCreateLocation);
        if (!locationId) {
            return false;
        }

        const payload = toUpdateDroneOperationRequest(values, locationId);
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
                loading={dialogLoading}
                error={dialogError}
                availableLocations={availableLocations}
                locationsLoading={locationsLoading}
                locationsError={locationsError}
                onClose={() => setOpen(false)}
                onSubmit={handleSubmit}
                onResetError={handleResetErrors}
            />
        </>
    );
}
