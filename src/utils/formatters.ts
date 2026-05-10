import dayjs from 'dayjs';

export function displayValue(value: string | null | undefined): string {
    return value && value.trim().length > 0 ? value : '-';
}

export function formatDate(value: string | null | undefined): string {
    if (!value) {
        return '-';
    }

    const parsed = dayjs(value);
    if (!parsed.isValid()) {
        return value;
    }

    return parsed.format('YYYY.MM.DD');
}

export function formatDateTime(value?: string | null): string {
    if (!value) {
        return '';
    }

    const parsed = dayjs(value);

    if (!parsed.isValid()) {
        return value;
    }

    return parsed.format('YYYY.MM.DD HH:mm');
}

export function formatFileSize(bytes: number | null | undefined): string {
    if (bytes == null || Number.isNaN(bytes)) {
        return '-';
    }

    if (bytes === 0) {
        return '0 B';
    }

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const index = Math.min(
        Math.floor(Math.log(bytes) / Math.log(1024)),
        units.length - 1,
    );

    const value = bytes / 1024 ** index;

    const fractionDigits =
        index === 0 ? 0 :
            index === 1 ? 1 :
                2;

    return `${value.toFixed(fractionDigits)} ${units[index]}`;
}

export function formatDistance(value: number | null): string {
    if (value == null) {
        return '';
    }

    if (value >= 1000) {
        return `${(value / 1000).toFixed(2)} km`;
    }

    return `${value.toFixed(2)} m`;
}

export function formatDurationSeconds(value: number | null): string {
    if (value == null) {
        return '';
    }

    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = value % 60;

    return [hours, minutes, seconds]
        .map((part) => String(part).padStart(2, '0'))
        .join(':');
}

