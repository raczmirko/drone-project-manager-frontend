import { TextField } from '@mui/material';

type ReadOnlyFieldProps = {
    label: string;
    value: string | null | undefined;
    multiline?: boolean;
    minRows?: number;
};

export default function ReadOnlyField({
                                          label,
                                          value,
                                          multiline = false,
                                          minRows,
                                      }: ReadOnlyFieldProps) {
    return (
        <TextField
            label={label}
            value={value ?? ''}
            fullWidth
            multiline={multiline}
            minRows={minRows}
            slotProps={{
                input: {
                    readOnly: true,
                },
            }}
        />
    );
}
