// src/app/not-found.tsx
import Link from "next/link";
export default function NotFound() {
  return (
    <section className="section">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl md:text-5xl font-semibold">Page not found</h1>
        <p className="mt-3 text-slate-700">Try one of these popular pages:</p>
        <div className="mt-5 flex flex-wrap gap-3 justify-center">
          <Link className="btn btn-primary" href="/">Home</Link>
          <Link className="btn btn-ghost" href="/jobs">Browse jobs</Link>
          <Link className="btn btn-ghost" href="/blog">Blog</Link>
        </div>
      </div>
    </section>
  );
}
