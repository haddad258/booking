import { useSnackbar } from 'notistack';
import { apiErrorMessage } from '../services/api';

export function useToast() {
  const { enqueueSnackbar } = useSnackbar();

  return {
    success: (message) => enqueueSnackbar(message, { variant: 'success' }),
    error: (err) => enqueueSnackbar(typeof err === 'string' ? err : apiErrorMessage(err), { variant: 'error' }),
  };
}

export default useToast;
