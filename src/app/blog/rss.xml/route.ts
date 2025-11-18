// src/app/blog/rss.xml/route.ts
import { NextResponse } from "next/server";
const site = "https://studentjobsrotterdam.nl";
const posts = [
  { slug: "english-speaking-student-jobs-rotterdam", title: "English-Speaking Student Jobs in Rotterdam (2025)" },
  { slug: "student-jobs-rotterdam-complete-guide-2025", title: "Student Jobs in Rotterdam — Complete Guide (2025)" },
  { slug: "best-paying-student-jobs-rotterdam-2025", title: "Best-Paying Student Jobs in Rotterdam (2025)" },
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
    <title>Student Jobs Rotterdam — Blog</title>
    <link>${site}/blog</link>
    <description>Guides for student jobs in Rotterdam</description>
    ${items}
  </channel></rss>`;
  return new NextResponse(xml, { headers: { "Content-Type": "application/xml" } });
}
