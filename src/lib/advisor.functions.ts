import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const schema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(4000) }))
    .min(1)
    .max(30),
});

type CatalogueUniversity = {
  name: string;
  country: string;
  city: string;
  fields: string[];
  levels: string[];
  tuition_eur: number;
  living_eur: number;
  min_score: number;
  min_ielts: number;
  intakes: string[];
  verified: boolean;
};

function safeText(value: string) {
  return value
    .replace(/<\/?(?:send_options|send_action_buttons)>/gi, "")
    .replace(/```(?:json)?[\s\S]*?```/gi, "")
    .replace(/\\n/g, "\n")
    .trim();
}

function localAnswer(
  question: string,
  profile: Record<string, unknown> | null,
  universities: CatalogueUniversity[],
  applications: unknown[],
) {
  const q = question.toLowerCase();
  const subject = String(profile?.["subject"] ?? "").toLowerCase();
  const preferences = Array.isArray(profile?.["preferred_countries"])
    ? (profile?.["preferred_countries"] as string[])
    : [];
  const budget = Number(profile?.["yearly_budget"] ?? 0);
  const ranked = universities
    .map((university) => {
      const fieldMatch = university.fields.some((field) => field.toLowerCase().includes(subject));
      const countryMatch = preferences.length === 0 || preferences.includes(university.country);
      const cost = Number(university.tuition_eur) + Number(university.living_eur);
      const budgetMatch = budget === 0 || cost <= budget;
      return {
        university,
        cost,
        score: Number(fieldMatch) * 3 + Number(countryMatch) * 2 + Number(budgetMatch),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (q.includes("application") || q.includes("journey") || q.includes("next step")) {
    return applications.length
      ? `You have ${applications.length} application${applications.length === 1 ? "" : "s"} in My Journey. Open My Journey to review the latest status, required documents and next action for each university.`
      : "You have not started an application yet. Complete your profile, compare your strongest matches, then start with one university so Livio can create the correct document checklist.";
  }
  if (q.includes("profile") || q.includes("improve")) {
    const profileFields: Array<[string, string]> = [
      ["subject", "preferred course"],
      ["qualification", "latest qualification"],
      ["score", "academic score"],
      ["yearly_budget", "yearly budget"],
      ["ielts_score", "English-test score"],
    ];
    const missing = profileFields
      .filter(([key]) => !profile?.[key])
      .map(([, label]) => label ?? "profile detail");
    return missing.length
      ? `Complete these profile details to improve your matches: ${missing.join(", ")}. You can update them from Profile.`
      : "Your core matching profile is complete. Confirm your preferred intake and verify current university requirements with your counsellor before applying.";
  }
  if (ranked.length) {
    const list = ranked
      .map(
        ({ university, cost }, index) =>
          `${index + 1}. ${university.name}, ${university.country} — about €${cost.toLocaleString()} per year`,
      )
      .join("\n");
    return `Based on your saved Livio profile, these are useful starting points:\n\n${list}\n\nThe catalogue is illustrative and not a guarantee of admission. Use Explore to compare the details and ask your counsellor to verify fees and eligibility.`;
  }
  return "I can help with university discovery, profile readiness, documents and application progress. Complete your profile first so my guidance can use your actual course, country and budget preferences.";
}

export const askAdvisor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => schema.parse(d))
  .handler(async ({ data, context }) => {
    const [{ data: profile }, { data: unis }, { data: apps }] = await Promise.all([
      context.supabase
        .from("student_profiles")
        .select(
          "subject, score, qualification, level, yearly_budget, ielts_score, preferred_countries, country",
        )
        .eq("user_id", context.userId)
        .maybeSingle(),
      context.supabase
        .from("universities")
        .select(
          "name, country, city, fields, levels, tuition_eur, living_eur, min_score, min_ielts, intakes, verified",
        ),
      context.supabase.from("applications").select("program, intake, status, universities(name)"),
    ]);

    const system = `You are Livio's study-abroad advisor for students. Be warm, concise and practical; use short paragraphs or bullet lists.
Only use the catalogue and student data below. Every catalogue figure is ILLUSTRATIVE and unverified unless "verified": true — say so when quoting costs or requirements.
Never invent fees, deadlines, visa rules, rankings or admission chances. If you don't know, say so and suggest the student ask their counsellor.
STUDENT PROFILE: ${JSON.stringify(profile ?? "not completed")}
STUDENT APPLICATIONS: ${JSON.stringify(apps ?? [])}
CATALOGUE (EUR per year): ${JSON.stringify(unis ?? [])}`;

    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      return {
        reply: localAnswer(
          data.messages.at(-1)?.content ?? "",
          (profile as Record<string, unknown> | null) ?? null,
          (unis as CatalogueUniversity[] | null) ?? [],
          apps ?? [],
        ),
      };
    }

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: system }, ...data.messages],
      }),
    });
    if (res.status === 429)
      return { error: "The advisor is busy right now. Please try again in a moment." };
    if (res.status === 402) return { error: "The advisor is temporarily unavailable." };
    if (!res.ok) return { error: "The advisor couldn't answer. Please try again." };
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const reply = safeText(json.choices?.[0]?.message?.content ?? "");
    return {
      reply:
        reply ||
        localAnswer(
          data.messages.at(-1)?.content ?? "",
          (profile as Record<string, unknown> | null) ?? null,
          (unis as CatalogueUniversity[] | null) ?? [],
          apps ?? [],
        ),
    };
  });
