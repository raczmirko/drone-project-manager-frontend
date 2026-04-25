export type DroneOperation = {
    id: string;
    name: string;
    code: string;
    date: string;
    objective: string | null;
    operationDate: string | null;
    description: string | null;
    locationId: string;
    locationName: string;
    drone: string | null;
    flightMode: string | null;
    weatherDescription: string | null;
    kpIndex: number | null;
    takeoffTime: string | null;
    landingTime: string | null;
    flightLength: number | null;
    flightDuration: string | null;
};

export type CreateDroneOperationRequest = {
    code: string;
    name: string;
    objective: string | null;
    operationDate: string | null;
    description: string | null;
    locationId: string;
    drone: string | null;
    flightMode: string | null;
    weatherDescription: string | null;
    kpIndex: number | null;
    takeoffTime: string | null;
    landingTime: string | null;
    flightLength: number | null;
    flightDuration: string | null;
};

export type UpdateDroneOperationRequest = {
    name: string;
    objective: string | null;
    operationDate: string | null;
    description: string | null;
    locationId: string;
    drone: string | null;
    flightMode: string | null;
    weatherDescription: string | null;
    kpIndex: number | null;
    takeoffTime: string | null;
    landingTime: string | null;
    flightLength: number | null;
    flightDuration: string | null;
};

export type OperationDocument = {
    id: string;
    filename: string;
    uploadDate: string | null;
    sizeBytes: number | null;
};