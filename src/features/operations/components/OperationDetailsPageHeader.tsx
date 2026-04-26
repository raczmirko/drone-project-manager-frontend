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
            direction="row"
            sx={{
                mb: 2,
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <Typography variant="h4" component="h1" sx={{ color: 'white' }}>
                {t('operations.details.title')}
            </Typography>

            <Stack direction="row" spacing={1}>
                {editAction}
                <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={onDelete}
                    sx={{ ml: 'auto' }}
                >
                    {t('general.actions.delete')}
                </Button>
            </Stack>
        </Stack>
    );
}
