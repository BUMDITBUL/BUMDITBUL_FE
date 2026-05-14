"use client";

import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { onboardingSchema, type OnboardingFormValues } from "@/features/auth/schemas/auth.schema";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/button";

type School = {
  SCHUL_NM: string;
  LCTN_SC_NM: string;
  SCHUL_KND_SC_NM: string;
};

type NeisRow = {
  SCHUL_NM: string;
  LCTN_SC_NM: string;
  SCHUL_KND_SC_NM: string;
  [key: string]: string;
};

type NeisResponse = {
  schoolInfo?: [{ head: unknown[] }, { row: NeisRow[] }];
  RESULT?: { CODE: string; MESSAGE: string };
};

async function fetchSchools(query: string): Promise<School[]> {
  const params = new URLSearchParams({
    Type: "json",
    pIndex: "1",
    pSize: "20",
    SCHUL_NM: query,
  });
  const res = await fetch(`https://open.neis.go.kr/hub/schoolInfo?${params}`);
  const data: NeisResponse = await res.json();
  if (!data.schoolInfo) return [];
  return (data.schoolInfo[1]?.row ?? []).map((r) => ({
    SCHUL_NM: r.SCHUL_NM,
    LCTN_SC_NM: r.LCTN_SC_NM,
    SCHUL_KND_SC_NM: r.SCHUL_KND_SC_NM,
  }));
}

export default function OnboardingForm() {
  const router = useRouter();
  const [schoolQuery, setSchoolQuery] = useState("");
  const [schoolResults, setSchoolResults] = useState<School[]>([]);
  const [isSearchingSchool, setIsSearchingSchool] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
  });

  const schoolValue = watch("school");

  const onSubmit = (_data: OnboardingFormValues) => {
    // TODO: API 연동
    router.push("/onboarding/step2");
  };

  const handleSchoolSearch = async () => {
    if (!schoolQuery.trim()) return;
    setIsSearchingSchool(true);
    setHasSearched(true);
    try {
      const results = await fetchSchools(schoolQuery);
      setSchoolResults(results);
    } catch {
      setSchoolResults([]);
    } finally {
      setIsSearchingSchool(false);
    }
  };

  const handleSchoolSelect = (schoolName: string) => {
    setValue("school", schoolName);
    setSchoolQuery("");
    setSchoolResults([]);
    setHasSearched(false);
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* 로고 + 타이틀 */}
      <div className="flex flex-col gap-3">
        <Image src="/images/logo.svg" alt="범딧불 로고" width={40} height={40} />
        <div className="flex flex-col gap-1">
          <h1 className="text-white text-2xl font-bold">
            범딧불이 처음이신가요?
          </h1>
          <p className="text-sm leading-relaxed text-white/55">
            범딧불을 조금 더 편하게 사용 할수 있도록 도와드릴게요!
          </p>
        </div>
      </div>

      {/* 폼 */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* 닉네임 */}
        <div className="flex flex-col gap-2">
          <label className="text-white/55 text-sm font-medium">닉네임</label>
          <Input
            placeholder="닉네임을 입력해주세요."
            error={!!errors.nickname}
            {...register("nickname")}
          />
          <p className="text-xs pl-[14px]">
            {errors.nickname ? (
              <span className="text-brand-error">{errors.nickname.message}</span>
            ) : (
              <span className="text-white/40">앞으로는 이렇게 불러 드릴게요.</span>
            )}
          </p>
        </div>

        {/* 학교 */}
        <div className="flex flex-col gap-2">
          <label className="text-white/55 text-sm font-medium">학교</label>

          {/* 선택된 학교 표시 */}
          {schoolValue ? (
            <div
              className="flex items-center justify-between px-4 text-white text-sm"
              style={{
                height: "46px",
                border: "1px solid rgba(255, 255, 255, 0.55)",
                borderRadius: "14px",
              }}
            >
              <span>{schoolValue}</span>
              <button
                type="button"
                onClick={() => setValue("school", "")}
                className="text-white/40 text-xs hover:text-white/70 transition-colors"
              >
                변경
              </button>
            </div>
          ) : (
            <>
              {/* 검색 입력 */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="교명을 검색해주세요."
                    value={schoolQuery}
                    onChange={(e) => setSchoolQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSchoolSearch();
                      }
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSchoolSearch}
                  disabled={isSearchingSchool}
                  className="shrink-0 px-5 text-white/55 text-sm transition-colors hover:bg-white/5"
                  style={{
                    height: "46px",
                    border: "1px solid rgba(255, 255, 255, 0.55)",
                    borderRadius: "14px",
                  }}
                >
                  {isSearchingSchool ? "검색 중" : "검색"}
                </button>
              </div>

              {/* 검색 결과 */}
              {isSearchingSchool && (
                <p className="text-white/40 text-xs pl-[14px]">검색 중...</p>
              )}
              {!isSearchingSchool && hasSearched && schoolResults.length === 0 && (
                <p className="text-white/40 text-xs pl-[14px]">검색 결과가 없습니다.</p>
              )}
              {!isSearchingSchool && schoolResults.length > 0 && (
                <div
                  className="flex flex-col"
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "14px",
                    overflow: "hidden",
                  }}
                >
                  {schoolResults.map((school, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSchoolSelect(school.SCHUL_NM)}
                      className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors"
                      style={{
                        borderBottom:
                          i < schoolResults.length - 1
                            ? "1px solid rgba(255, 255, 255, 0.08)"
                            : "none",
                      }}
                    >
                      <p className="text-white text-sm">{school.SCHUL_NM}</p>
                      <p className="text-white/40 text-xs mt-0.5">
                        {school.LCTN_SC_NM} · {school.SCHUL_KND_SC_NM}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          <p className="text-xs text-white/40 pl-[14px]">
            시험당일 재학생분들의 시험을 응원해드려요.{" "}
            <span className="text-brand-green-200">(필수 X)</span>
          </p>
        </div>

        {/* 안내 문구 */}
        <p className="text-sm text-white/55">
          범딧불을 이용 하시기 전에 미리 확인할 내용이 남아 있어요.
        </p>

        <Button type="submit" variant="primary">
          다음으로
        </Button>
      </form>

      {/* 페이지 표시 */}
      <p className="text-sm text-right">
        <span className="text-white">1</span>
        <span className="text-white/55">/3</span>
      </p>
    </div>
  );
}
