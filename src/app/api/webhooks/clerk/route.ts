/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Webhook, type WebhookRequiredHeaders } from "svix";
import crypto from "crypto";

export const runtime = "nodejs"; // svix verification requires Node runtime

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

type ClerkEmail = { id: string; email_address: string };
type ClerkUser = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  primary_email_address_id: string | null;
  email_addresses: ClerkEmail[];
};

type ClerkEvent =
  | { type: "user.created"; data: ClerkUser }
  | { type: "user.updated"; data: ClerkUser }
  | { type: "user.deleted"; data: { id: string } };

function getPrimaryEmail(user: ClerkUser): string | null {
  const pid = user.primary_email_address_id;
  if (!pid || !user.email_addresses?.length) return null;
  const match = user.email_addresses.find((e) => e.id === pid);
  return match?.email_address ?? user.email_addresses[0]?.email_address ?? null;
}

function generateFallbackUsername() {
  // short random fallback like "user_a1b2c3"
  return "user_" + crypto.randomBytes(3).toString("hex");
}

export async function POST(req: NextRequest) {
  // 1) Read raw body for signature verification
  const payload = await req.text();

  // 2) Verify with Svix using Clerk secret
  const headers = req.headers as unknown as WebhookRequiredHeaders;
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let evt: ClerkEvent;
  try {
    evt = wh.verify(payload, headers) as ClerkEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (evt.type) {
      case "user.created": {
        const u = evt.data;
        const email = getPrimaryEmail(u);
        const username = u.username ?? generateFallbackUsername();

        const { error } = await supabase.from('profiles').insert(
          { id: u.id, email, username, first_name: u.first_name ?? null, last_name: u.last_name ?? null }
        );
        if (error) throw error;
        break;
      }

      case "user.updated": {
        const u = evt.data;
        const email = getPrimaryEmail(u);
        const { error } = await supabase
          .from("profiles")
          .update({
            email,
            username: u.username ?? null, // keep existing if you prefer; here we mirror Clerk
            first_name: u.first_name ?? null,
            last_name: u.last_name ?? null,
          })
          .eq("id", u.id);
        if (error) throw error;
        break;
      }

      case "user.deleted": {
        const { error } = await supabase
          .from("profiles")
          .delete()
          .eq("id", evt.data.id);
        if (error) throw error;
        break;
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "DB error" },
      { status: 500 }
    );
  }
}
