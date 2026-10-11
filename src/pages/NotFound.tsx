import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-[11px] uppercase tracking-luxe text-muted-foreground">
        404
      </p>
      <h1 className="mt-4 font-display text-5xl font-medium">
        This page stepped out.
      </h1>
      <p className="mt-4 text-sm text-foreground/60">
        The page you're looking for doesn't exist — but the collection does.
      </p>
      <Link
        to="/"
        className="mt-8 bg-primary px-10 py-4 text-[12px] uppercase tracking-luxe text-primary-foreground transition-opacity hover:opacity-90"
      >
        Return Home
      </Link>
    </div>
  );
}
