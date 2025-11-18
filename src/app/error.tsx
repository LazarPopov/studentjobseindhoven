// src/app/error.tsx
"use client";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <section className="section">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl md:text-5xl font-semibold">Something went wrong</h1>
        <button className="btn btn-primary mt-4" onClick={() => reset()}>Try again</button>
      </div>
    </section>
  );
}
