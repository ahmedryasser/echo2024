import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';

interface QACollapseProps {
    index: number
    title: string
    text: string
    expanded?: boolean
    onChange?: (event: React.SyntheticEvent, expanded: boolean) => void
}

export const QACollapse: React.FC<QACollapseProps> = ({ index, title, text, expanded, onChange }) => {
    const theme = useTheme();

    return (
        <Accordion
            disableGutters
            expanded={expanded}
            onChange={onChange}
            sx={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                mb: 1,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                boxShadow: 'none',
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
                sx={{
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                    },
                }}
            >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Q{index + 1}. {title}
                </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 2 }}>
                <Typography variant="body2">
                    A{index + 1}. {text}
                </Typography>
            </AccordionDetails>
        </Accordion>
    );
};