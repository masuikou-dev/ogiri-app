import { createClient } from "@supabase/supabase-js";

let client: ReturnType<typeof createClient> | null = null;

function pickEnvValue(keys: string[]): string {
	for (const key of keys) {
		const value = process.env[key];
		if (typeof value === "string" && value.trim() !== "") {
			return value.trim();
		}
	}
	return "";
}

function resolveSupabaseUrl(): string {
	return pickEnvValue(["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL"]);
}

function resolveSupabaseKey(): string {
	return pickEnvValue([
		"NEXT_PUBLIC_SUPABASE_ANON_KEY",
		"SUPABASE_ANON_KEY",
		"SUPABASE_SERVICE_ROLE_KEY",
	]);
}

function createMissingEnvMessage(variableName: string, fallbackName?: string): string {
	const fallbackText = fallbackName ? ` (or ${fallbackName})` : "";
	return [
		`Supabase environment variable is missing: ${variableName}${fallbackText}`,
		"Set it in .env.local and restart the Next.js dev server.",
		"Example:",
		"NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co",
		"NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY",
	].join("\n");
}

export function getSupabaseClient() {
	if (client) return client;

	const supabaseUrl = resolveSupabaseUrl();
	const supabaseKey = resolveSupabaseKey();

	if (!supabaseUrl) {
		throw new Error(createMissingEnvMessage("NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL"));
	}

	if (!supabaseKey) {
		throw new Error(
			createMissingEnvMessage("NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_ANON_KEY")
		);
	}

	try {
		new URL(supabaseUrl);
	} catch {
		throw new Error(
			`Supabase URL is invalid: "${supabaseUrl}". Check NEXT_PUBLIC_SUPABASE_URL in .env.local.`
		);
	}

	client = createClient(supabaseUrl, supabaseKey, {
		auth: {
			persistSession: false,
			autoRefreshToken: false,
		},
	});

	return client;
}
