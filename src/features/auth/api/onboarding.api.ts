import { apiRequest } from "@/lib/api";

export type SubjectItemRequest = {
  subjectName: string;
  difficulty: "HIGH" | "MEDIUM" | "LOW";
  testSchedule: string; // YYYY-MM-DD
  startPage?: number;
  endPage?: number;
};

export function updateOnboardingProfile(
  payload: { nickname?: string; school?: string },
  accessToken: string | null
) {
  return apiRequest<{ nickname: string; school: string; onboardingCompleted: boolean }>(
    "/onboarding/profile",
    { method: "PATCH", body: payload, accessToken }
  );
}

export function saveSubjects(subjects: SubjectItemRequest[], accessToken: string | null) {
  return apiRequest<{ subjects: unknown[] }>("/subjects", {
    method: "PUT",
    body: { subjects },
    accessToken,
  });
}

export function generateSchedule(accessToken: string | null) {
  return apiRequest<{ status: string }>("/schedule/generate", {
    method: "POST",
    accessToken,
  });
}
