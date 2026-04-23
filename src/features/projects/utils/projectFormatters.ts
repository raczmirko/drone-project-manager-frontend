export function displayValue(value: string | null | undefined): string {
    return value && value.trim().length > 0 ? value : '-';
}

export function formatDate(value: string | null | undefined): string {
    if (!value) {
        return '-';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    }).format(date);
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

    return `${new Intl.NumberFormat(undefined, {
        maximumFractionDigits: value < 10 && index > 0 ? 1 : 0,
    }).format(value)} ${units[index]}`;
}

