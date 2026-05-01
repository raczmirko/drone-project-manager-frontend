// --- TYPES FOR FLIGHT PATH MAP ---

import type {
    OperationFlightAnalysisResponse,
    OperationImageMetadataExtractionResponse, OperationImageMetadataRow
} from "./operationImageMetadataTypes.ts";
import type {GridPaginationModel} from "@mui/x-data-grid";

export type OperationFlightPathPoint = {
    id: string;
    capturedAt: string | null;
    gpsLatitude: number | null;
    gpsLongitude: number | null;
};

export type OperationFlightPathMapProps = {
    rows: OperationFlightPathPoint[];
    loading?: boolean;
    error?: string | null;
};

// --- TYPES FOR FLIGHT ANALYSIS ---

export type OperationFlightAndImageryAnalysisSectionProps = {
    uploadLoading: boolean;
    uploadError: string | null;
    uploadResult: OperationImageMetadataExtractionResponse | null;
    onUpload: (files: File[]) => Promise<void>;

    analysis: OperationFlightAnalysisResponse | null;
    analysisLoading: boolean;
    analysisError: string | null;
    onAnalyze: () => Promise<void>;

    onPurgeMetadata: () => Promise<void>;

    flightPathRows: OperationFlightPathPoint[];
    flightPathLoading: boolean;
    flightPathError: string | null;

    rows: OperationImageMetadataRow[];
    gridLoading: boolean;
    gridError: string | null;
    rowCount: number;
    paginationModel: GridPaginationModel;
    onPaginationModelChange: (model: GridPaginationModel) => void;

    metadataInitialized: boolean;

    dashboardData: OperationImageMetadataDashboardResponse | null;
    dashboardLoading: boolean;
    dashboardError: string | null;
};

export type AltitudeProfilePoint = {
    sequence: number;
    capturedAt: string | null;
    altitude: number;
};

export type AltitudeDistributionBucket = {
    bucketLabel: string;
    count: number;
};

export type DistanceAltitudePoint = {
    distanceMeters: number;
    altitude: number;
};

export type GroundTrackPoint = {
    sequence: number;
    capturedAt: string | null;
    latitude: number;
    longitude: number;
    altitude: number | null;
};

export type OperationImageMetadataDashboardResponse = {
    altitudeProfile: AltitudeProfilePoint[];
    altitudeDistribution: AltitudeDistributionBucket[];
    distanceAltitudeProfile: DistanceAltitudePoint[];
    groundTrack: GroundTrackPoint[];
};