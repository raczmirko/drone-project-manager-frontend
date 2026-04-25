export type Project = {
    id: string;
    code: string;
    name: string;
    status: string | null;
    description: string | null;
    objective: string | null;
    startDate: string | null;
    endDate: string | null;
};

export type DroneOperation = {
    id: string;
    code: string;
    name: string;
    type: string | null;
    status: string | null;
    date: string | null;
};

export type ProjectDocument = {
    id: string;
    filename: string;
    uploadDate: string | null;
    sizeBytes: number | null;
};

export type PageResponse<T> = {
    content: T[];
    totalElements: number;
    totalPages?: number;
    size?: number;
    number?: number;
};

export type CreateOperationRequest = {
    name: string;
    type: string | null;
    status: string | null;
    date: string | null;
};

export type CreateProjectRequest = {
    code: string;
    name: string;
    status: string | null;
    description: string | null;
    objective: string | null;
    startDate: string | null;
    endDate: string | null;
};

export type CreateProjectFormValues = {
    code: string;
    name: string;
    status: string;
    description: string;
    objective: string;
    startDate: string;
    endDate: string;
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
