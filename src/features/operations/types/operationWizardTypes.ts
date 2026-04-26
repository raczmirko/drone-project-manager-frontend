export type LocationOption = {
    id: string;
    name: string;
    longitude: string;
    latitude: string;
};

export type CreateLocationFormValues = {
    name: string;
    longitude: string;
    latitude: string;
};

export type DroneOperationFormValues = {
    code: string;
    name: string;
    date: string;
    drone: string;
    objective: string;
    description: string;
    flightMode: string;
    weatherDescription: string;
    kpIndex: string;
    takeoffTime: string;
    landingTime: string;
};

export type CreateOperationWizardInitialValues = {
    selectedLocationId: string;
    createLocation: CreateLocationFormValues;
    operation: DroneOperationFormValues;
};

export type CreateOperationWizardSubmitValues = {
    locationId: string;
    operation: DroneOperationFormValues;
};

export const EMPTY_LOCATION_FORM: CreateLocationFormValues = {
    name: '',
    longitude: '',
    latitude: '',
};

export const EMPTY_OPERATION_DETAILS_FORM: DroneOperationFormValues = {
    code: '',
    name: '',
    date: '',
    drone: '',
    objective: '',
    description: '',
    flightMode: '',
    weatherDescription: '',
    kpIndex: '',
    takeoffTime: '',
    landingTime: '',
};