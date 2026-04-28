"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import ExamRangeForm from "@/features/profile/components/ExamRangeForm";

export default function OnboardingStep3Form() {
  const router = useRouter();

  const handleComplete = () => {
    // TODO: API 연동
    router.push("/");
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
      <ExamRangeForm />

      {/* 완료 버튼 + 페이지 표시 */}
      <div className="flex flex-col gap-1 shrink-0">
        <Button type="button" variant="primary" onClick={handleComplete}>
          완료
        </Button>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/")}
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
