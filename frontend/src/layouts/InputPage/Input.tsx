import React from 'react';
import { Box, Container, Paper } from '@mui/material';
import { Footer } from '../NavbarAndFooter/Footer';
import { LogoComponent } from './Components/LogoComponent';
import { UploadForm } from './Components/UploadForm';

export const Input: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 4,
          }}
        >
          <LogoComponent />
          <UploadForm />
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};