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