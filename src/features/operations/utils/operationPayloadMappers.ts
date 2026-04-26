import type {
    CreateOperationWizardInitialValues,
    CreateOperationWizardSubmitValues,
} from '../types/operationWizardTypes.ts';
import type {
    CreateDroneOperationRequest,
    DroneOperation,
    UpdateDroneOperationRequest,
} from '../types/operationTypes.ts';

function trimOrNull(value: unknown): string | null {
    if (typeof value !== 'string') {
        return null;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}

function stringValue(value: unknown): string {
    if (value == null) {
        return '';
    }

    return String(value);
}

function numberOrNull(value: unknown): number | null {
    if (typeof value !== 'string') {
        return null;
    }

    const trimmed = value.trim();

    if (trimmed.length === 0) {
        return null;
    }

    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? null : parsed;
}

function toOperationBaseRequest(
    values: CreateOperationWizardSubmitValues,
): Omit<CreateDroneOperationRequest, 'code'> {
    return {
        name: values.operation.name.trim(),
        date: values.operation.date,
        locationId: values.locationId,
        drone: values.operation.drone.trim(),
        objective: trimOrNull(values.operation.objective),
        description: trimOrNull(values.operation.description),
        flightMode: trimOrNull(values.operation.flightMode),
        weatherDescription: trimOrNull(values.operation.weatherDescription),
        kpIndex: numberOrNull(values.operation.kpIndex),
        takeoffTime: trimOrNull(values.operation.takeoffTime),
        landingTime: trimOrNull(values.operation.landingTime),
    };
}

export function toCreateDroneOperationRequest(
    values: CreateOperationWizardSubmitValues,
): CreateDroneOperationRequest {
    return {
        code: values.operation.code.trim(),
        ...toOperationBaseRequest(values),
    };
}

export function toUpdateDroneOperationRequest(
    values: CreateOperationWizardSubmitValues,
): UpdateDroneOperationRequest {
    return {
        ...toOperationBaseRequest(values),
    };
}

export function toOperationWizardInitialValues(
    operation: DroneOperation,
): CreateOperationWizardInitialValues {
    const locationId = operation.location?.id ?? '';
    const locationName = operation.location?.name ?? '';
    const latitude = operation.location?.latitude ?? '';
    const longitude = operation.location?.longitude ?? '';

    return {
        selectedLocationId: locationId,
        createLocation: {
            name: stringValue(locationName),
            latitude: stringValue(latitude),
            longitude: stringValue(longitude),
        },
        operation: {
            code: operation.code ?? '',
            name: operation.name ?? '',
            date: operation.date ?? '',
            drone: operation.drone ?? '',
            objective: operation.objective ?? '',
            description: operation.description ?? '',
            flightMode: operation.flightMode ?? '',
            weatherDescription: operation.weatherDescription ?? '',
            kpIndex: operation.kpIndex != null ? String(operation.kpIndex) : '',
            takeoffTime: operation.takeoffTime ?? '',
            landingTime: operation.landingTime ?? '',
        },
    };
}