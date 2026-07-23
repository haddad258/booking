import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function EntityDialog({ open, title, onClose, onSubmit, loading, children, maxWidth = 'sm' }) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
      <form onSubmit={onSubmit}>
        <DialogTitle fontWeight={700}>{title}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ pt: 0.5 }}>
            {children}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="contained" color="secondary" disabled={loading}>
            {t('common.save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
