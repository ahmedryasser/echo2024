import * as React from 'react';
import { Chip, Grid } from '@mui/material';

export interface OutputOption {
  value: string;
  label: string;
}

interface OutputSelectorChipsProps {
  options: OutputOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export const OutputSelectorChips: React.FC<OutputSelectorChipsProps> = ({ options, selected, onChange }) => {
  const handleChipClick = (optionValue: string) => {
    if (selected.includes(optionValue)) {
      onChange(selected.filter(v => v !== optionValue));
    } else {
      onChange([...selected, optionValue]);
    }
  };

  return (
    <Grid container spacing={2}>
      {options.map((option) => (
        <Grid item xs={4} key={option.value}>
          <Chip
            sx={{ width: '100%' }}
            label={option.label}
            onClick={() => handleChipClick(option.value)}
            color={selected.includes(option.value) ? 'primary' : 'default'}
            variant={selected.includes(option.value) ? 'filled' : 'outlined'}
            aria-label={option.label}
          />
        </Grid>
      ))}
    </Grid>
  );
}; 