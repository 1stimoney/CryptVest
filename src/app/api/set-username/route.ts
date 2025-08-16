import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

function isValidUsername(u: string) {
  // letters, numbers, underscore, 3-20 chars
  return /^[a-zA-Z0-9_]{3,20}$/.test(u);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { username } = await req.json();
  if (typeof username !== "string" || !isValidUsername(username)) {
    return NextResponse.json(
      { error: "Invalid username. Use 3–20 letters, numbers, or underscore." },
      { status: 400 }
    );
  }

  // Uniqueness check (case-insensitive if you added the index)
  const { data: existing, error: checkErr } = await supabase
    .from("profiles")
    .select("id, username")
    .ilike("username", username) // use .eq if case-sensitive
    .maybeSingle();

  if (checkErr) {
    return NextResponse.json({ error: checkErr.message }, { status: 500 });
  }
  if (existing && existing.id !== userId) {
    return NextResponse.json({ error: "Username already taken" }, { status: 400 });
  }

  const { error } = await supabase
    .from("profiles")
    .update({ username })
    .eq("id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
