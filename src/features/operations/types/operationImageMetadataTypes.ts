export type OperationImageMetadataStatus = 'EXTRACTED' | 'ERROR';

export type OperationImageMetadataRow = {
    id: string;
    originalFilename: string;
    mimeType: string | null;
    fileSizeBytes: number | null;
    imageWidth: number | null;
    imageHeight: number | null;
    capturedAt: string | null;
    gpsLatitude: number | null;
    gpsLongitude: number | null;
    gpsAltitude: number | null;
    cameraMake: string | null;
    cameraModel: string | null;
    metadataStatus: OperationImageMetadataStatus;
    metadataError: string | null;
    createdAt: string;
};

export type OperationImageMetadataPageResponse = {
    content: OperationImageMetadataRow[];
    totalElements: number;
    page: number;
    size: number;
};

export type OperationImageMetadataExtractionResponse = {
    processedCount: number;
    extractedCount: number;
    errorCount: number;
};

export type OperationFlightAnalysisResponse = {
    flightDurationSeconds: number | null;
    avgRecordingAltitude: number | null;
    recordingLength: number | null;
    recordingStart: string | null;
    recordingEnd: string | null;
    numberOfRecordings: number;
};