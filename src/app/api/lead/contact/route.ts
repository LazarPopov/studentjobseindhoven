// src/app/api/contact/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();

  // honeypot
  if (form.get("website")) {
    return NextResponse.redirect(new URL("/contact/thank-you", req.url), { status: 303 });
  }

  const payload = {
    name: String(form.get("name") || ""),
    email: String(form.get("email") || ""),
    subject: String(form.get("subject") || ""),
    message: String(form.get("message") || ""),
    submittedAt: new Date().toISOString(),
  };

  // TODO: replace with your DB/email integration (Resend/Supabase/etc.)
  console.log("[CONTACT_FORM]", payload);

  return NextResponse.redirect(new URL("/contact/thank-you", req.url), { status: 303 });
}
