"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { onboardingSchema, type OnboardingFormValues } from "@/features/auth/schemas/auth.schema";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/button";

export default function OnboardingForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
  });

  const onSubmit = (_data: OnboardingFormValues) => {
    // TODO: API 연동
    router.push("/onboarding/step2");
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
          <Input
            placeholder="교명을 검색해주세요."
            readOnly
            {...register("school")}
            rightElement={
              <button type="button" onClick={() => { /* TODO: NEIS API 검색 */ }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="opacity-40">
                  <circle cx="7.5" cy="7.5" r="5.5" stroke="white" strokeWidth="1.5" />
                  <path d="M12 12l3.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            }
          />
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
        <span className="text-white/55">/2</span>
      </p>
    </div>
  );
}
