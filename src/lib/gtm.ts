// src/lib/gtm.ts
// Small helper for programmatic events (e.g., on form submit)
export function gtmEvent(event: string, params: Record<string, any> = {}) {
  if (typeof window === "undefined") return;
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({ event, ...params });
}
