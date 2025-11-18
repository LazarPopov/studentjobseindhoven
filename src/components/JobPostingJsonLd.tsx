// UPDATE in: src/components/JobPostingJsonLd.tsx
import React from "react";
import type { JobRecord } from "@/data/jobs";

function asText(html: string) {
  return html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
             .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
             .replace(/<[^>]*>/g, " ")
             .replace(/\s+/g, " ")
             .trim();
}

function salaryBlock(job: JobRecord) {
  if (!job.currency || (!job.baseSalaryMin && !job.baseSalaryMax)) return undefined;
  const value: Record<string, any> = { "@type": "QuantitativeValue", unitText: job.payUnit || "HOUR" };
  if (typeof job.baseSalaryMin === "number") value.minValue = job.baseSalaryMin;
  if (typeof job.baseSalaryMax === "number") value.maxValue = job.baseSalaryMax;
  if (!value.minValue && value.maxValue) value.value = value.maxValue; // single value fallback
  return { "@type": "MonetaryAmount", currency: job.currency, value };
}

export default function JobPostingJsonLd({
  job,
  canonicalUrl,
}: {
  job: JobRecord;
  canonicalUrl: string;
}) {
  const siteOrigin = new URL(canonicalUrl).origin;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: asText(job.descriptionHtml || job.shortDescrition || ""),
    datePosted: job.datePosted,
    ...(job.validThrough ? { validThrough: job.validThrough } : {}),
    ...(job.employmentType ? { employmentType: job.employmentType } : {}),
    hiringOrganization: {
      "@type": "Organization",
      name: job.orgName,
      url: siteOrigin, // ✅ valid property; points to your site
      ...(job.logoUrl ? { logo: new URL(job.logoUrl, siteOrigin).toString() } : {}),
      sameAs: siteOrigin, // keep your brand URL
    },
    identifier: {
      "@type": "PropertyValue",
      name: job.orgName,
      value: job.slug,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.addressLocality,
        ...(job.addressRegion ? { addressRegion: job.addressRegion } : { addressRegion: "ZH" }),
        ...(job.postalCode ? { postalCode: job.postalCode } : {}),
        ...(job.streetAddress ? { streetAddress: job.streetAddress } : {}),
        addressCountry: "NL",
      },
    },
    ...(salaryBlock(job) ? { baseSalary: salaryBlock(job) } : {}),
    ...(job.workHours ? { workHours: job.workHours } : {}),
    ...(job.externalUrl ? { employmentUnit: { "@type": "Organization", url: job.externalUrl } } : {}), // optional: expose apply destination without invalid keys
    directApply: Boolean(job.externalUrl),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
