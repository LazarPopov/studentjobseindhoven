// src/app/thank-you/page.tsx  (generic thank-you used by newsletter)
export default function ThankYou() {
  return (
    <section className="section">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl md:text-4xl font-semibold">Thanks — we got your submission!</h1>
        <p className="mt-3 text-slate-700">
          You’ll hear from us soon. Meanwhile, check the latest student jobs.
        </p>
        <a href="/jobs" className="btn btn-primary mt-5 inline-flex">Browse jobs</a>
      </div>
    </section>
  );
}
