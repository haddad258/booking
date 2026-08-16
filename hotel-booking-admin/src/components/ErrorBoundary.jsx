import { Component } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';

/**
 * Design-system fix (Phase 2B): there was no error boundary anywhere in the
 * admin app, so any uncaught render error — a null-reference in a page
 * component, a malformed API response shape, etc. — showed a blank white
 * screen with no way to recover short of the browser back button. For a
 * "premium, professional" admin dashboard this is the single worst-case UX
 * outcome. This catches render errors anywhere in the tree below it and
 * shows a branded, actionable fallback instead.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('Unhandled UI error:', error, info?.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.assign('/');
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          p: 4,
          bgcolor: 'background.default',
        }}
      >
        <ReportProblemOutlinedIcon sx={{ fontSize: 56, color: 'secondary.main', mb: 2 }} />
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Something went wrong
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 420 }}>
          An unexpected error occurred while rendering this page. Your data is safe — try reloading,
          or head back to the dashboard.
        </Typography>
        <Stack direction="row" spacing={1.5}>
          <Button variant="outlined" onClick={() => window.location.reload()}>
            Reload page
          </Button>
          <Button variant="contained" color="secondary" onClick={this.handleReset}>
            Back to dashboard
          </Button>
        </Stack>
      </Box>
    );
  }
}
