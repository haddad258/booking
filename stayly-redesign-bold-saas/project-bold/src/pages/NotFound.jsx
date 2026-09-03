import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="font-display text-7xl font-extrabold text-gradient">404</p>
      <p className="mb-6 mt-2 text-ink/60 dark:text-white/60">This page doesn't exist.</p>
      <Button to="/">Back home</Button>
    </div>
  );
}
