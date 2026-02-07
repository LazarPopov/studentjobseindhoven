// src/app/blog/layout.tsx
import type { Metadata } from "next";
import BackButton from "@/components/BackButton";

const CANONICAL = "https://studentjobsamsterdam.nl/blog";
const OG_IMAGE_URL = "https://studentjobsamsterdam.nl/blog/amsterdam-bridge.jpg";

export const metadata: Metadata = {
  title: {
    default: "Amsterdam Student Jobs Blog (2026) | Student Jobs Amsterdam",
    template: "%s | Student Jobs Amsterdam",
  },
  description:
    "Amsterdam student job guides for 2026: English-friendly part-time jobs, pay, contracts, permits, CV tips, and where to apply fast.",
  alternates: { canonical: CANONICAL },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Amsterdam Student Jobs Blog (2026) | Student Jobs Amsterdam",
    description:
      "Guides on Amsterdam student jobs: English-speaking roles, wages, contracts, permits, and quick application tactics.",
    url: CANONICAL,
    type: "website",
    locale: "en_NL",
    siteName: "Student Jobs Amsterdam",
    images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: "Amsterdam bridge" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Amsterdam Student Jobs Blog (2026) | Student Jobs Amsterdam",
    description:
      "Find English-friendly student jobs in Amsterdam: pay, contracts, permits, and fast apply tips.",
    images: [OG_IMAGE_URL],
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 border-b flex items-center justify-between">
        <BackButton />
        <div className="flex flex-col">
          <h1 className="text-xl font-bold">Blog</h1>
          <p className="text-xs text-slate-600">
            Amsterdam student jobs, pay, contracts, and English-friendly work.
          </p>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
