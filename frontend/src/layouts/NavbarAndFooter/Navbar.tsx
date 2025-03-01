import * as React from 'react';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// import { SpinnerLoading } from "../Utils/SpinnerLoading"

export const Navbar = () => {
    const theme = useTheme();

    return (
        <AppBar position="static" sx={{ backgroundColor: theme.palette.grey[900] }}>
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'common.white' }}>
                        ECHO
                    </Typography>
                </Toolbar>
            </Container>
        </AppBar>
    )
}