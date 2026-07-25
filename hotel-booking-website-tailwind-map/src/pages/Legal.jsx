function LegalPage({ title, children }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="font-display mb-2 text-3xl font-semibold text-ink">{title}</h1>
      <p className="mb-6 text-sm text-ink/45">Last updated: July 2026</p>
      <div className="space-y-4 text-ink/75">{children}</div>
    </div>
  );
}

export function Privacy() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        We collect only the information needed to create your account, process bookings, and provide customer
        support: your name, email, phone number, and booking history. We never sell your personal data to third
        parties.
      </p>
      <p>
        Payment details are handled by our payment processors and are never stored on our servers. You can
        request a copy of your data or ask us to delete your account at any time by contacting support.
      </p>
    </LegalPage>
  );
}

export function Terms() {
  return (
    <LegalPage title="Terms of Service">
      <p>
        By creating an account and making a booking through this platform, you agree to provide accurate
        information and to honor the cancellation policy shown at the time of booking.
      </p>
      <p>
        Properties listed on this platform are owned and operated by independent hotels and chalet owners.
        We facilitate the booking and payment process but are not the operator of the property itself.
      </p>
    </LegalPage>
  );
}

export function Cookies() {
  return (
    <LegalPage title="Cookie Policy">
      <p>
        We use essential cookies to keep you signed in and to remember your language preferences. We do not
        use third-party advertising cookies.
      </p>
    </LegalPage>
  );
}
