"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import ExamRangeForm, { type ExamSubjectData } from "@/features/profile/components/ExamRangeForm";
import { saveSubjects, generateSchedule } from "@/features/auth/api/onboarding.api";
import { getAccessToken } from "@/lib/authTokens";
import ErrorMessage from "@/components/ui/ErrorMessage";

const DIFFICULTY_MAP = { 상: "HIGH", 중: "MEDIUM", 하: "LOW" } as const;

export default function OnboardingStep3Form() {
  const router = useRouter();
  const [initialSubjectNames, setInitialSubjectNames] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const subjectsRef = useRef<ExamSubjectData[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bumditbul.onboardingSubjects");
      setInitialSubjectNames(stored ? JSON.parse(stored) : []);
    } catch {
      setInitialSubjectNames([]);
    }
  }, []);

  const handleSubjectsChange = useCallback((subjects: ExamSubjectData[]) => {
    subjectsRef.current = subjects;
  }, []);

  const handleComplete = async () => {
    setError(null);
    setIsLoading(true);

    const valid = subjectsRef.current.filter(s => s.name.trim() && s.date.trim());

    try {
      if (valid.length > 0) {
        await saveSubjects(
          valid.map(s => ({
            subjectName: s.name.trim(),
            difficulty: DIFFICULTY_MAP[s.difficulty],
            testSchedule: s.date.replace(/\./g, "-"),
            ...(s.startPage ? { startPage: parseInt(s.startPage) } : {}),
            ...(s.endPage ? { endPage: parseInt(s.endPage) } : {}),
          })),
          getAccessToken()
        );
        await generateSchedule(getAccessToken());
      }
      localStorage.removeItem("bumditbul.onboardingSubjects");
      router.push("/main");
    } catch {
      setError("일정 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[720px] flex flex-col min-h-0 px-10 py-8 gap-5">
      {/* 헤더 */}
      <div className="flex flex-col gap-3 shrink-0">
        <Image src="/images/logo.svg" alt="범딧불 로고" width={40} height={40} />
        <div className="flex flex-col gap-1">
          <h1 className="text-white text-2xl font-bold">시험 범위를 입력해주세요.</h1>
          <p className="text-sm leading-relaxed text-white/55">
            입력된 데이터를 바탕으로 학습 플랜이 생성됩니다.{" "}
            <span className="text-brand-green-200">(나중에 수정 가능)</span>
          </p>
        </div>
      </div>

      {/* 시험범위 폼 */}
      {initialSubjectNames !== null && (
        <ExamRangeForm
          key={initialSubjectNames.join(",")}
          initialSubjectNames={initialSubjectNames}
          onChange={handleSubjectsChange}
        />
      )}

      {/* 완료 버튼 + 페이지 표시 */}
      <div className="flex flex-col gap-1 shrink-0">
        {error && <ErrorMessage message={error} />}
        <Button type="button" variant="primary" onClick={handleComplete} disabled={isLoading}>
          {isLoading ? "생성 중..." : "완료"}
        </Button>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => { localStorage.removeItem("bumditbul.onboardingSubjects"); router.push("/main"); }}
            className="text-sm text-white/35 hover:text-white/60 transition-colors"
          >
            나중에 하기
          </button>
          <p className="text-sm">
            <span className="text-white">3</span>
            <span className="text-white/55">/3</span>
          </p>
        </div>
      </div>
    </div>
  );
}
