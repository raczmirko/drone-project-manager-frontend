import type { PropsWithChildren, ReactNode } from 'react';
import { Paper, Stack, Typography } from '@mui/material';

type SectionCardProps = PropsWithChildren<{
    title: string;
    action?: ReactNode;
}>;

export default function SectionCard({ title, action, children }: SectionCardProps) {
    return (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Stack
                direction="row"
                sx={{
                    mb: 2,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Typography variant="h6">{title}</Typography>
                {action}
            </Stack>

            {children}
        </Paper>
    );
}
