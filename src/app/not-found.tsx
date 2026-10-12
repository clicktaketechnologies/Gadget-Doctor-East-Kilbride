export const metadata = {
  title: "Page Not Found — Gadget Doctor East Kilbride",
  description: "The page you're looking for doesn't exist. Browse our repair services or contact us.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-4 text-center">
      <div className="text-7xl font-bold text-gradient-cyan">404</div>
      <h1 className="text-2xl font-semibold text-foreground">Page Not Found</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>
      <a
        href="/"
        className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90"
      >
        ← Back to Home
      </a>
    </div>
  );
}
