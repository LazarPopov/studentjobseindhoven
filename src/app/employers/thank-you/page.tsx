// src/app/employers/thank-you/page.tsx
export default function EmployersThankYou() {
  return (
    <section className="section">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl md:text-4xl font-semibold">Thanks — we received your job!</h1>
        <p className="mt-3 text-slate-700">
          We’ll review it shortly and get back to you if we need anything else.
        </p>
        <div className="mt-5 flex gap-3">
          <a href="/employers" className="btn btn-ghost">Back</a>
          <a href="/jobs" className="btn btn-primary">Browse student jobs</a>
        </div>
      </div>
    </section>
  );
}
