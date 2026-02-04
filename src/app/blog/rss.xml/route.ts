// src/app/blog/rss.xml/route.ts
import { NextResponse } from "next/server";
const site = "https://studentjobsamsterdam.nl";
const posts = [
  { slug: "english-speaking-student-jobs-amsterdam", title: "English-Speaking Student Jobs in Amsterdam (2026)" },
  { slug: "student-jobs-amsterdam-complete-guide-2026", title: "Student Jobs in Amsterdam — Complete Guide (2026)" },
  { slug: "best-paying-student-jobs-amsterdam-2026", title: "Best-Paying Student Jobs in Amsterdam (2026)" },
];
export async function GET() {
  const items = posts.map(p => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${site}/blog/${p.slug}</link>
      <guid isPermaLink="true">${site}/blog/${p.slug}</guid>
    </item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0"><channel>
    <title>Student Jobs Amsterdam — Blog</title>
    <link>${site}/blog</link>
    <description>Guides for student jobs in Amsterdam</description>
    ${items}
  </channel></rss>`;
  return new NextResponse(xml, { headers: { "Content-Type": "application/xml" } });
}
