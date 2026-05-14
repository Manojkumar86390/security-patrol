import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function readUrl(): string {
  return (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
}

/** Supabase dashboard labels this "anon" "public" key — support both env names. */
function readKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    "";
  return key.trim();
}

/**
 * If non-null, do not call Supabase — the message explains what to fix in `.env.local`.
 * Fixes cryptic errors like "invalid path specified url" when the URL is empty or not a real URL.
 */
export function getSupabaseConfigError(): string | null {
  const url = readUrl();
  const key = readKey();

  if (!url && !key) {
    return "Supabase is not configured. In .env.local set NEXT_PUBLIC_SUPABASE_URL (Project URL) and NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_KEY (anon public key) from Supabase → Settings → API.";
  }
  if (!url) {
    return "NEXT_PUBLIC_SUPABASE_URL is missing in .env.local. Use your Project URL, e.g. https://xxxx.supabase.co (Supabase → Settings → API).";
  }
  if (!key) {
    return "Supabase anon key is missing. Set NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_KEY in .env.local (Supabase → Settings → API → anon public).";
  }

  if (/\s/.test(url) || /\s/.test(key)) {
    return "Remove spaces and surrounding quotes from NEXT_PUBLIC_SUPABASE_URL and the key in .env.local.";
  }

  try {
    const u = new URL(url);
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      return "NEXT_PUBLIC_SUPABASE_URL must start with https://";
    }
    if (!u.hostname.includes(".") && u.hostname !== "localhost") {
      return "NEXT_PUBLIC_SUPABASE_URL looks invalid (hostname). Use the full URL from Supabase, e.g. https://xxxx.supabase.co";
    }
  } catch {
    return 'NEXT_PUBLIC_SUPABASE_URL is not a valid URL. Example: https://abcdefghijk.supabase.co — copy "Project URL" from Supabase → Settings → API.';
  }

  return null;
}

let cached: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (getSupabaseConfigError()) return null;
  if (!cached) {
    cached = createClient(readUrl(), readKey(), {
      auth: { persistSession: false },
    });
  }
  return cached;
}
