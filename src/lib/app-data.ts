import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type University = Tables<"universities">;
export type Profile = Tables<"student_profiles">;
export type Application = Tables<"applications">;
export type AppStatus = Application["status"];

export async function getUserId() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not signed in");
  return data.user.id;
}

export const profileQuery = queryOptions({
  queryKey: ["profile"],
  queryFn: async () => {
    const id = await getUserId();
    const { data, error } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("user_id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
});

export const universitiesQuery = queryOptions({
  queryKey: ["universities"],
  queryFn: async () => {
    const { data, error } = await supabase.from("universities").select("*").order("name");
    if (error) throw error;
    return data;
  },
});

export const savedQuery = queryOptions({
  queryKey: ["saved"],
  queryFn: async () => {
    const { data, error } = await supabase.from("saved_universities").select("university_id");
    if (error) throw error;
    return data.map((r) => r.university_id);
  },
});

export const applicationsQuery = queryOptions({
  queryKey: ["applications"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("applications")
      .select("*, universities(name, city, country)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const documentsQuery = queryOptions({
  queryKey: ["documents"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const notificationsQuery = queryOptions({
  queryKey: ["notifications"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const counsellorQuery = queryOptions({
  queryKey: ["counsellor"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("counsellor_assignments")
      .select("counsellors(name, email, phone, languages, bio)")
      .maybeSingle();
    if (error) throw error;
    return data?.counsellors ?? null;
  },
});

export const STATUS_LABEL: Record<AppStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under review",
  offer: "Offer received",
  accepted: "Accepted",
  rejected: "Not successful",
  withdrawn: "Withdrawn",
};
export const STATUS_STEPS: AppStatus[] = ["submitted", "under_review", "offer", "accepted"];

export const DOC_KINDS = [
  "Passport",
  "Academic transcript",
  "Degree / school certificate",
  "English test result",
  "Statement of purpose",
  "Recommendation letter",
  "CV / Resume",
  "Financial proof",
  "Other",
];

export type MatchReason = {
  label: string;
  ok: boolean;
  detail: string;
  weight: number;
  earned: number;
};

/** Weighted fit: field 30, budget 25, academic score 20, English 15, country 10. */
export function matchUniversity(p: Profile, u: University) {
  const reasons: MatchReason[] = [];
  const subject = p.subject.toLowerCase();
  const fieldOk = u.fields.some(
    (f) => subject.includes(f.toLowerCase()) || f.toLowerCase().includes(subject),
  );
  reasons.push({
    label: "Subject",
    weight: 30,
    ok: fieldOk,
    earned: fieldOk ? 30 : 0,
    detail: fieldOk ? `Offers ${p.subject}` : `Main fields: ${u.fields.join(", ")}`,
  });
  const total = Number(u.tuition_eur) + Number(u.living_eur);
  const budget = Number(p.yearly_budget);
  const budgetEarned = total <= budget ? 25 : total <= budget * 1.2 ? 12 : 0;
  reasons.push({
    label: "Budget",
    weight: 25,
    ok: budgetEarned === 25,
    earned: budgetEarned,
    detail: `About €${total.toLocaleString()}/yr vs your €${budget.toLocaleString()}`,
  });
  const score = Number(p.score);
  const scoreEarned = score >= Number(u.min_score) ? 20 : score >= Number(u.min_score) - 5 ? 10 : 0;
  reasons.push({
    label: "Academics",
    weight: 20,
    ok: scoreEarned === 20,
    earned: scoreEarned,
    detail: `Your ${score}% vs typical minimum ${u.min_score}%`,
  });
  const ielts = p.ielts_score == null ? null : Number(p.ielts_score);
  const ieltsEarned =
    ielts == null
      ? 7
      : ielts >= Number(u.min_ielts)
        ? 15
        : ielts >= Number(u.min_ielts) - 0.5
          ? 7
          : 0;
  reasons.push({
    label: "English",
    weight: 15,
    ok: ieltsEarned === 15,
    earned: ieltsEarned,
    detail:
      ielts == null
        ? `IELTS not provided (needs ~${u.min_ielts})`
        : `IELTS ${ielts} vs ${u.min_ielts}`,
  });
  const prefs = p.preferred_countries ?? [];
  const countryOk = prefs.length === 0 || prefs.includes(u.country);
  reasons.push({
    label: "Country",
    weight: 10,
    ok: countryOk,
    earned: countryOk ? 10 : 0,
    detail: countryOk ? `${u.country} fits your preferences` : `${u.country} isn't on your list`,
  });
  const levelOk = u.levels.includes(p.level);
  const raw = reasons.reduce((s, r) => s + r.earned, 0);
  return { score: levelOk ? raw : Math.round(raw * 0.5), reasons, levelOk };
}

export function rankUniversities(p: Profile, unis: University[]) {
  return unis.map((u) => ({ u, m: matchUniversity(p, u) })).sort((a, b) => b.m.score - a.m.score);
}

export const eur = (n: number | string) => `€${Number(n).toLocaleString()}`;
