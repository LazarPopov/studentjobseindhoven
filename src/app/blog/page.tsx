// ✅ 3) BLOG INDEX listing all posts (no MDX required)
// src/app/blog/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

const POSTS = [
  {
    slug: "studenten-bijbaan-rotterdam",
    title: "Studenten bijbaan Rotterdam (2025) – Goed betaald, Engelstalig & weekend",
    description:
      "De ultieme gids voor een studenten bijbaan in Rotterdam: avond/weekend, Engelstalig, zonder ervaring. Uurloon-tabellen, contractvormen, wijken en snelle filters.",
  },
  {
    slug: "student-jobs-rotterdam-complete-guide-2025",
    title: "Student Jobs in Rotterdam — Complete Guide (2025)",
    description:
      "Permits, contracts, pay, neighborhoods, and tactics to land a job fast.",
  },
  {
    slug: "english-speaking-student-jobs-rotterdam",
    title: "English-Speaking Student Jobs in Rotterdam (2025)",
    description:
      "Where to find roles that don’t require Dutch, with quick-apply tips.",
  },
  {
    slug: "best-paying-student-jobs-rotterdam-2025",
    title: "Best-Paying Student Jobs in Rotterdam (2025)",
    description:
      "Shift bonuses, industries, and certifications that increase pay.",
  },
];


export const metadata: Metadata = {
  title: "Blog | Student Jobs Rotterdam",
  description: "Guides and tips to help you land a student job in Rotterdam.",
  alternates: { canonical: "https://studentjobsrotterdam.nl/blog" },
};

export default function BlogIndex() {
  return (
    <section className="px-6 py-10 bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl md:text-5xl font-semibold">Blog</h1>
        <p className="mt-3 text-slate-700 max-w-2xl">
          Practical, local guides for students working in Rotterdam.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {POSTS.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="rounded-2xl border bg-white p-5 hover:shadow-md transition"
            >
              <div className="text-lg font-semibold">{p.title}</div>
              <p className="text-gray-600 text-sm mt-2">{p.description}</p>
              <div className="mt-3 text-sm underline">Read more</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
  