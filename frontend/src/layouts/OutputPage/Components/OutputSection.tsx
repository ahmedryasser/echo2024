import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

interface OutputSectionProps {
  title: string;
  text: string;
}

export const OutputSection: React.FC<OutputSectionProps> = ({ title, text }) => {
  return (
    <Card
      sx={{
        mb: 2,
        bgcolor: 'background.paper',
        color: 'text.primary',
        border: 1,
        borderColor: 'divider',
        boxShadow: 3,
      }}
    >
      <CardHeader 
        title={
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
        } 
      />
      <Divider />
      <CardContent>
        <Typography variant="body1">
          <ReactMarkdown>{text}</ReactMarkdown>
        </Typography>
      </CardContent>
    </Card>
  );
};