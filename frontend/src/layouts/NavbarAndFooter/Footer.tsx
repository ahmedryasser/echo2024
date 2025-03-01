import * as React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const Footer = () => {
    const theme = useTheme();

    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: theme.palette.grey[900],
                py: 2,
                mt: 'auto',
            }}
        >
            <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="body1" color="common.white">
                    © Echo Project Team
                </Typography>
            </Container>
        </Box>
    );
}