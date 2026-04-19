import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import type { TypographyProps } from '@mui/material/Typography';

export default function CopyrightTypography(props: TypographyProps) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'DroneProjectManager © '}
            <Link color="inherit" href="https://github.com/raczmirko">
                Mirkó Rácz
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}
