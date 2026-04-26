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
    objective: string;
    date: string;
    description: string;
    drone: string;
    flightMode: string;
    weatherDescription: string;
    kpIndex: string;
    takeoffTime: string;
    landingTime: string;
    flightLength: string;
    flightDurationSeconds: string;
};

export type CreateOperationWizardSubmitValues =
    | {
    locationMode: 'existing';
    location: LocationOption;
    operation: DroneOperationFormValues;
}
    | {
    locationMode: 'new';
    location: CreateLocationFormValues;
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
    objective: '',
    date: '',
    description: '',
    drone: '',
    flightMode: '',
    weatherDescription: '',
    kpIndex: '',
    takeoffTime: '',
    landingTime: '',
    flightLength: '',
    flightDurationSeconds: '',
};
