import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/AddRounded';

export default function PageHeader({ title, subtitle, actionLabel, onAction, actionIcon }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, gap: 2, flexWrap: 'wrap' }}>
      <Box>
        <Typography variant="h5" fontWeight={700}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {onAction && (
        <Button variant="contained" color="secondary" startIcon={actionIcon || <AddIcon />} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
