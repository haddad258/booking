import { Container, Typography } from '@mui/material';

function LegalPage({ title, children }) {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>{title}</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>Last updated: July 2026</Typography>
      {children}
    </Container>
  );
}

export function Privacy() {
  return (
    <LegalPage title="Privacy Policy">
      <Typography paragraph>
        We collect only the information needed to create your account, process bookings, and provide customer
        support: your name, email, phone number, and booking history. We never sell your personal data to third
        parties.
      </Typography>
      <Typography paragraph>
        Payment details are handled by our payment processors and are never stored on our servers. You can
        request a copy of your data or ask us to delete your account at any time by contacting support.
      </Typography>
    </LegalPage>
  );
}

export function Terms() {
  return (
    <LegalPage title="Terms of Service">
      <Typography paragraph>
        By creating an account and making a booking through this platform, you agree to provide accurate
        information and to honor the cancellation policy shown at the time of booking.
      </Typography>
      <Typography paragraph>
        Properties listed on this platform are owned and operated by independent hotels and chalet owners.
        We facilitate the booking and payment process but are not the operator of the property itself.
      </Typography>
    </LegalPage>
  );
}

export function Cookies() {
  return (
    <LegalPage title="Cookie Policy">
      <Typography paragraph>
        We use essential cookies to keep you signed in and to remember your language and theme preferences.
        We do not use third-party advertising cookies.
      </Typography>
    </LegalPage>
  );
}
