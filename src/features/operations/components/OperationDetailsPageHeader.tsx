import {Button, Stack, Typography} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {useTranslation} from 'react-i18next';
import React from "react";

type OperationDetailsPageHeaderProps = {
    onDelete: () => void;
    editAction?: React.ReactNode;
};

export default function OperationDetailsPageHeader({ onDelete, editAction }: OperationDetailsPageHeaderProps) {
    const { t } = useTranslation();
    return (
        <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 2, sm: 0 }}
            sx={{
                mb: 2,
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
            }}
        >
            <Typography
                variant="h4"
                component="h1"
                sx={{
                    color: 'white',
                    textAlign: { xs: 'center', sm: 'left' },
                    width: '100%',
                }}
            >
                {t('operations.details.title')}
            </Typography>

            <Stack
                direction="row"
                spacing={1}
                sx={{
                    flexWrap: 'wrap',
                    justifyContent: { xs: 'center', sm: 'flex-end' },
                    width: '100%',
                }}
            >
                {editAction}
                <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={onDelete}
                    sx={{
                        width: { xs: '100%', sm: 'auto' }, // Full width on mobile
                    }}
                >
                    {t('general.actions.delete')}
                </Button>
            </Stack>
        </Stack>
    );
}
