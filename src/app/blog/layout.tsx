// ✅ 2) BLOG LAYOUT with Back button (scoped to /blog + children)
// src/app/blog/layout.tsx
import type { Metadata } from "next";
import BackButton from "@/components/BackButton";

export const metadata: Metadata = {
  title: "Blog | Student Jobs Rotterdam",
  description: "Articles and tips for student jobs in Rotterdam.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 border-b flex items-center justify-between">
        <BackButton />
        <h1 className="text-xl font-bold">Blog</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
