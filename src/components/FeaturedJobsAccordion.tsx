// src/components/FeaturedJobsAccordion.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState } from "react";

type Job = {
  slug: string;
  externalUrl?: string;
  logoUrl?: string;
  logoAlt?: string;
  orgName?: string;
  title: string;
  shortDescrition?: string; // (keep your original key)
  descriptionHtml?: string; // long HTML shown when expanded
  area?: string;
  englishFriendly?: boolean;
  DUO?: boolean;
};

export default function FeaturedJobsAccordion({ featuredJobs }: { featuredJobs: Job[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const uid = useId();

  // --- GTM helper: push a custom event to the dataLayer
  const gtm = (event: string, params: Record<string, any> = {}) => {
    if (typeof window === "undefined") return;
    // @ts-ignore
    window.dataLayer = window.dataLayer || [];
    // @ts-ignore
    window.dataLayer.push({ event, ...params });
  };

  // Build a readable, low-cardinality GA4 event name from the job title
  const eventNameFromTitle = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_") // non-alphanum -> underscore
      .replace(/^_+|_+$/g, "") // trim underscores
      .slice(0, 40); // curb cardinality
    return `applied_to_${slug || "job"}`;
  };

  // On first render, announce that nothing is open (useful in DebugView)
  useEffect(() => {
    gtm("accordion_state", {
      open_slug: null,
      open_title: null,
      open_org: null,
      open_index: null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = (job: Job, index: number, panelId: string) => {
    const willOpen = openSlug !== job.slug;
    const nextOpen = willOpen ? job.slug : null;

    setOpenSlug((prev) => (prev === job.slug ? null : job.slug));

    // Discrete action event
    gtm(willOpen ? "job_expand" : "job_collapse", {
      slug: job.slug,
      title: job.title,
      org: job.orgName || "",
      index,
      panel_id: panelId,
    });

    // Single source of truth for "what's open now"
    gtm("accordion_state", {
      open_slug: nextOpen,
      open_title: nextOpen ? job.title : null,
      open_org: nextOpen ? job.orgName || "" : null,
      open_index: nextOpen ? index : null,
      panel_id: nextOpen ? panelId : null,
    });

    // Smooth scroll into view on small screens
    if (willOpen && typeof window !== "undefined") {
      const el = document.getElementById(panelId);
      setTimeout(() => el?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
    }
  };

  return (
    // Mobile: single column grid.
    // md+ : masonry via CSS columns so expanded cards don't stretch siblings.
    <div className="mt-4 md:mt-6 grid grid-cols-1 gap-4 md:block md:columns-2 lg:columns-3 md:[column-gap:1rem] lg:[column-gap:1.25rem]">
      {featuredJobs.map((job, index) => {
        const isOpen = openSlug === job.slug;
        const panelId = `${uid}-${job.slug}-panel`;

        return (
          <div
            key={job.slug}
            className={`mb-4 break-inside-avoid rounded-2xl bg-white/95 backdrop-blur border border-white/40 p-5 shadow-sm transition ${
              isOpen ? "shadow-md" : "hover:shadow-md"
            }`}
            data-gtm-prop-index={index}
            data-gtm-prop-slug={job.slug}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative h-10 w-10 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0">
                  {job.logoUrl ? (
                    <Image
                      src={job.logoUrl}
                      alt={job.logoAlt || `${job.orgName ?? "Company"} logo`}
                      fill
                      sizes="40px"
                      className="object-contain"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-slate-500">
                      {job.orgName?.[0] ?? "•"}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-lg font-semibold truncate">{job.title}</div>
                  <div className="text-slate-600 truncate">{job.orgName}</div>
                </div>
              </div>
              <div className="text-xs font-medium text-emerald-700 shrink-0">Hiring now</div>
            </div>

            {/* Always-visible short description */}
            {job.shortDescrition && (
              <p className="mt-3 text-sm text-slate-700 line-clamp-2">{job.shortDescrition}</p>
            )}

            {/* Meta chips */}
            <div className="mt-3 text-xs text-slate-700 flex flex-wrap items-center gap-2">
              {job.area && <span>{job.area}</span>}
              {job.englishFriendly && (
                <span className="inline-flex items-center rounded-full border px-2 py-0.5">
                  English-friendly
                </span>
              )}
              {job.DUO && (
                <span className="inline-flex items-center rounded-full border px-2 py-0.5">
                  Works with DUO
                </span>
              )}
            </div>

            {/* Toggle */}
            <div className="mt-3">
              <button
                type="button"
                onClick={() => handleToggle(job, index, panelId)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="text-sm underline underline-offset-2"
                data-gtm-event={isOpen ? "job_collapse" : "job_expand"} // for delegation if you want
                data-gtm-label={job.title}
                data-gtm-prop-slug={job.slug}
                data-gtm-prop-org={job.orgName || ""}
                data-gtm-prop-index={index}
              >
                {isOpen ? "Hide details" : "Learn more"}
              </button>
            </div>

            {/* Expanded panel */}
            {isOpen && (
              <div id={panelId} role="region" className="mt-4">
                <hr className="border-slate-200 mb-3" />
                {job.descriptionHtml ? (
                  <div
                    className="prose prose-sm max-w-none text-slate-800"
                    dangerouslySetInnerHTML={{ __html: job.descriptionHtml }}
                  />
                ) : null}

                {/* Sticky apply for long content */}
                <div className="sticky bottom-0 mt-4 pt-3 bg-white/90 backdrop-blur">
                  {job.externalUrl ? (
                    <a
                      href={job.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-xl px-4 py-2 border bg-black text-white text-sm"
                      onClick={() => {
                        // Standard apply event
                        gtm("job_apply", {
                          slug: job.slug,
                          title: job.title,
                          org: job.orgName || "",
                          destination: "external",
                          index,
                        });
                        // Friendly named event e.g. "applied_to_barista_part_time"
                        gtm(eventNameFromTitle(job.title), {
                          slug: job.slug,
                          title: job.title,
                          org: job.orgName || "",
                          destination: "external",
                          index,
                        });
                      }}
                      data-gtm-event="job_apply"
                      data-gtm-label={job.title}
                      data-gtm-prop-slug={job.slug}
                      data-gtm-prop-org={job.orgName || ""}
                      data-gtm-prop-index={index}
                    >
                      Apply
                    </a>
                  ) : (
                    <Link
                      href={`/jobs/${job.slug}`}
                      className="inline-flex items-center justify-center rounded-xl px-4 py-2 border bg-black text-white text-sm"
                      onClick={() => {
                        // Standard apply event
                        gtm("job_apply", {
                          slug: job.slug,
                          title: job.title,
                          org: job.orgName || "",
                          destination: "internal",
                          index,
                        });
                        // Friendly named event e.g. "applied_to_barista_part_time"
                        gtm(eventNameFromTitle(job.title), {
                          slug: job.slug,
                          title: job.title,
                          org: job.orgName || "",
                          destination: "internal",
                          index,
                        });
                      }}
                      data-gtm-event="job_apply"
                      data-gtm-label={job.title}
                      data-gtm-prop-slug={job.slug}
                      data-gtm-prop-org={job.orgName || ""}
                      data-gtm-prop-index={index}
                    >
                      Apply
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
