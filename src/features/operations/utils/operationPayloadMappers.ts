import type {
    CreateLocationFormValues,
    CreateOperationWizardSubmitValues,
    LocationOption
} from "../types/operationWizardTypes.ts";
import type {
    CreateDroneOperationRequest,
    DroneOperation,
    UpdateDroneOperationRequest
} from "../types/operationTypes.ts";


/**
 * Trims the string and returns null if it's empty.'
 * @param value The string to trim.
 */
function trimOrNull(value: unknown): string | null {
    if (typeof value !== 'string') {
        return null;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}

/**
 * Maps the operation wizard form values to the request payload.
 * @param values The form values.
 * @param locationId The ID of the location.
 */
export function toOperationBaseRequest(
    values: CreateOperationWizardSubmitValues,
    locationId: string,
): Omit<CreateDroneOperationRequest, 'code'> {
    return {
        name: values.operation.name.trim(),
        objective: trimOrNull(values.operation.objective),
        date: values.operation.date || null,
        description: trimOrNull(values.operation.description),
        locationId,
        drone: trimOrNull(values.operation.drone),
        flightMode: trimOrNull(values.operation.flightMode),
        weatherDescription: trimOrNull(values.operation.weatherDescription),
        kpIndex: values.operation.kpIndex ? Number(values.operation.kpIndex) : null,
        takeoffTime: values.operation.takeoffTime || null,
        landingTime: values.operation.landingTime || null,
        flightLength: values.operation.flightLength ? Number(values.operation.flightLength) : null,
        flightDurationSeconds: values.operation.flightDurationSeconds,
    };
}

/**
 * Maps the operation wizard form values to the request payload.
 * @param values The form values.
 * @param locationId The ID of the location.
 */
export function toCreateDroneOperationRequest(
    values: CreateOperationWizardSubmitValues,
    locationId: string,
): CreateDroneOperationRequest {
    return {
        code: values.operation.code.trim(),
        ...toOperationBaseRequest(values, locationId),
    };
}

/**
 * Maps the operation wizard form values to the request payload.
 * @param values The form values.
 * @param locationId The ID of the location.
 */
export function toUpdateDroneOperationRequest(
    values: CreateOperationWizardSubmitValues,
    locationId: string,
): UpdateDroneOperationRequest {
    return {
        ...toOperationBaseRequest(values, locationId),
    } as UpdateDroneOperationRequest;
}

/**
 * Resolves the location ID based on the form values.
 * @param values The form values.
 * @param onCreateLocation A function to create a new location.
 * @returns The location ID or null if the location is new.
 */
export async function resolveOperationLocationId(
    values: CreateOperationWizardSubmitValues,
    onCreateLocation: (values: CreateLocationFormValues) => Promise<LocationOption | null>,
): Promise<string | null> {
    if (values.locationMode === 'existing') {
        return 'id' in values.location ? values.location.id : null;
    }

    const createdLocation = await onCreateLocation(values.location as CreateLocationFormValues);
    return createdLocation?.id ?? null;
}

/**
 * Maps the operation to the initial values for the operation wizard.
 * @param operation The operation.
 * @returns The initial values.
 */
export function toOperationWizardInitialValues(
    operation: DroneOperation,
): CreateOperationWizardSubmitValues {
    const locationId = operation.location?.id ?? null;
    const locationName = operation.location?.name ?? '';
    const latitude = operation.location?.latitude ?? '';
    const longitude = operation.location?.longitude ?? '';

    return {
        operation: {
            code: operation.code ?? '',
            name: operation.name ?? '',
            objective: operation.objective ?? '',
            date: operation.date ?? '',
            description: operation.description ?? '',
            drone: operation.drone ?? '',
            flightMode: operation.flightMode ?? '',
            weatherDescription: operation.weatherDescription ?? '',
            kpIndex: operation.kpIndex != null ? String(operation.kpIndex) : '',
            takeoffTime: operation.takeoffTime ?? '',
            landingTime: operation.landingTime ?? '',
            flightLength: operation.flightLength != null ? String(operation.flightLength) : '',
            flightDurationSeconds: operation.flightDurationSeconds ?? '',
        },
        locationMode: locationId ? 'existing' : 'new',
        location: locationId
            ? {
                id: locationId,
                name: locationName,
                latitude,
                longitude,
            }
            : {
                name: locationName,
                latitude,
                longitude,
            },
    };
}
