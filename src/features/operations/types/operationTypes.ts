import type {OperationFlightAnalysisResponse} from "./operationImageMetadataTypes.ts";

export type Location = {
    id: string;
    name: string;
    longitude: string;
    latitude: string;
};

export type DroneOperation = {
    id: string;
    name: string;
    code: string;
    date: string;
    objective: string | null;
    description: string | null;
    location: Location;
    drone: string | null;
    flightMode: string | null;
    weatherDescription: string | null;
    kpIndex: number | null;
    takeoffTime: string | null;
    landingTime: string | null;
};

export type CreateDroneOperationRequest = {
    code: string;
    name: string;
    objective: string | null;
    date: string | null;
    description: string | null;
    locationId: string;
    drone: string | null;
    flightMode: string | null;
    weatherDescription: string | null;
    kpIndex: number | null;
    takeoffTime: string | null;
    landingTime: string | null;
};

export type UpdateDroneOperationRequest = {
    name: string;
    objective: string | null;
    date: string | null;
    description: string | null;
    locationId: string;
    drone: string | null;
    flightMode: string | null;
    weatherDescription: string | null;
    kpIndex: number | null;
    takeoffTime: string | null;
    landingTime: string | null;
};

export type OperationDocument = {
    id: string;
    filename: string;
    uploadDate: string | null;
    sizeBytes: number | null;
};

export type OperationFlightAnalysisCardProps = {
    analysis: OperationFlightAnalysisResponse | null;
    loading: boolean;
    error: string | null;
    onAnalyze: () => Promise<void>;
    onPurgeMetadata: () => void;
};