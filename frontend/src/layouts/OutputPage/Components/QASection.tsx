import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { QACollapse } from "./QACollapse"

interface QASectionProps {
    title: string;
    qAndA: { question: string; answer: string }[];
}

export const QASection: React.FC<QASectionProps> = ({ title, qAndA }) => {
    const theme = useTheme();
    const [expandedItems, setExpandedItems] = React.useState<number[]>([]);

    // Toggle all QACollapse items
    const handleToggleAll = () => {
        if (expandedItems.length === qAndA.length) {
            setExpandedItems([]);
        } else {
            setExpandedItems(qAndA.map((_, index) => index));
        }
    };

    // Toggle a single QACollapse
    const handleChange = (index: number, isExpanded: boolean) => {
        setExpandedItems((prev) => {
            if (isExpanded) {
                return [...prev, index];
            } else {
                return prev.filter((i) => i !== index);
            }
        });
    };

    return (
        <Card
            sx={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                mb: 2,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                boxShadow: 1,
            }}
        >
            <CardHeader
                title={
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {title}
                    </Typography>
                }
            />
            <CardContent>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleToggleAll}>
                        {expandedItems.length === qAndA.length ? 'Collapse All' : 'Expand All'}
                    </Button>
                </Stack>
                {qAndA.map((item, index) => (
                    <QACollapse
                        key={index}
                        index={index}
                        title={item.question}
                        text={item.answer}
                        expanded={expandedItems.includes(index)}
                        onChange={(event, isExpanded) => handleChange(index, isExpanded)}
                    />
                ))}
            </CardContent>
        </Card>
    )
}