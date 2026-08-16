import { Dialog, DialogTitle, DialogContent, Box, Typography, DialogActions, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, loading }) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{title || t('common.delete')}</DialogTitle>
      <DialogContent>
        <Box sx={{ color: 'text.secondary' }}>
          {typeof message === 'string' || message === undefined ? (
            <Typography color="text.secondary">{message || t('common.confirmDelete')}</Typography>
          ) : (
            message
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} disabled={loading}>
          {t('common.cancel')}
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={loading}>
          {t('common.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
