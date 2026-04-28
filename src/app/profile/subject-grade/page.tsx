"use client";

import { useState } from "react";
import MainNav from "@/components/common/MainNav";
import SubjectGradeForm from "@/features/profile/components/SubjectGradeForm";
import SaveButton from "@/components/ui/SaveButton";
import BackButton from "@/components/ui/BackButton";

type Subject = {
  id: number;
  name: string;
  level: string;
  nameEdited: boolean;
  levelEdited: boolean;
};

export default function SubjectGradePage() {
  const [currentSubjects, setCurrentSubjects] = useState<Subject[]>([]);

  const handleSave = async () => {
    // Perform save logic here
    console.log("Saving subjects:", currentSubjects);
    // You can add API call or other save logic
  };

  return (
    <div className="h-screen flex flex-col bg-brand-black-900 overflow-hidden">
      <MainNav />
      <div className="flex-1 min-h-0 flex justify-center overflow-hidden">
        <div className="w-full max-w-[1080px] flex flex-col min-h-0 px-6 py-6 gap-5">

          {/* 뒤로가기 */}
          <BackButton href="/profile" />

          {/* 타이틀 */}
          <div className="flex flex-col gap-1.5 shrink-0">
            <h1 className="text-white font-bold text-2xl">과목별 성적을 수정해주세요.</h1>
            <p className="text-white/55 text-sm">
              입력하지 않은 과목은{" "}
              <span className="text-brand-green-400">제외</span>
              되며, 성적은{" "}
              <span className="text-brand-green-400">자동으로 중</span>
              으로 설정 됩니다.
            </p>
          </div>

          {/* 본문 */}
          <div className="flex gap-6 flex-1 min-h-0">
            <SubjectGradeForm onChange={setCurrentSubjects} />

            {/* 우측 사이드바 */}
            <div className="flex flex-col gap-4 shrink-0" style={{ width: "360px" }}>
              {/* 알림 사항 */}
              <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: "var(--color-surface)" }}>
                <div className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="7.5" stroke="#66bb6a" strokeWidth="1.3" />
                    <path d="M9 8v4" stroke="#66bb6a" strokeWidth="1.3" strokeLinecap="round" />
                    <circle cx="9" cy="5.5" r="0.9" fill="#66bb6a" />
                  </svg>
                  <span className="text-white font-semibold text-sm">알림 사항</span>
                </div>
                <ul className="flex flex-col gap-3">
                  <li className="flex gap-2 text-white/55 text-xs leading-relaxed">
                    <span className="text-white/25 shrink-0">•</span>
                    <span>
                      언제든 다시 수정할 수 있지만,<br />
                      수정된 성적으로 플랜이 재생성됩니다.
                    </span>
                  </li>
                  <li className="flex gap-2 text-white/55 text-xs leading-relaxed">
                    <span className="text-white/25 shrink-0">•</span>
                    <span>
                      성적은{" "}
                      <span className="text-brand-green-400">누락 없이</span>{" "}
                      정확하게 기입해주세요.
                    </span>
                  </li>
                  <li className="flex gap-2 text-white/55 text-xs leading-relaxed">
                    <span className="text-white/25 shrink-0">•</span>
                    <span>입력된 데이터를 바탕으로 학습 플랜이 생성됩니다.</span>
                  </li>
                </ul>
              </div>

              <SaveButton
                title="성적을 저장하시겠습니까?"
                description="저장된 성적을 바탕으로 학습 플랜이 재생성됩니다."
                onSave={handleSave}
                withRegenLimit
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
