"use client";

import Image from "next/image";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useRouter } from 'next/navigation';

export default function OnboardingForm() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [school, setSchool] = useState("");
  const [schoolLevel, setSchoolLevel] = useState("중학교");
  const [nicknameError, setNicknameError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const schoolLevels = ["초등학교", "중학교", "고등학교", "대학교"];

  const validateNickname = (value: string) => {
    const nicknameRegex = /^[가-힣]{2,5}$/;
    return nicknameRegex.test(value);
  };

  const handleSubmit = () => {
    if (!nickname.trim()) {
      setNicknameError("닉네임은 공백으로 둘 수 없습니다.");
      return;
    }
    if (!validateNickname(nickname)) {
      setNicknameError("닉네임은 2~5자 한글만 가능합니다.");
      return;
    }
    setNicknameError("");
    router.push('/onboarding/step2');
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
      <div className="flex flex-col gap-5">
        {/* 닉네임 */}
        <div className="flex flex-col gap-2">
          <label className="text-white/55 text-sm font-medium">닉네임</label>
          <Input
            placeholder="닉네임을 입력해주세요."
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              setNicknameError("");
            }}
            error={!!nicknameError}
          />
          <p className="text-xs pl-[14px]">
            {nicknameError ? (
              <span className="text-brand-error">{nicknameError}</span>
            ) : (
              <span className="text-white/40">
                앞으로는 이렇게 불러 드릴게요.
              </span>
            )}
          </p>
        </div>

        {/* 학교 + 학교급 */}
        <div className="flex flex-col gap-2">
          <label className="text-white/55 text-sm font-medium">학교</label>
          <div className="flex gap-2 items-start">
            <div className="flex-1 min-w-0">
              <Input
                placeholder="교명을 입력해주세요."
                value={school}
                onChange={(e) => setSchool(e.target.value)}
              />
            </div>
            {/* 커스텀 드롭다운 */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-white/55 text-sm"
                style={{
                  height: "46px",
                  padding: "0 16px",
                  border: "1px solid rgba(255, 255, 255, 0.55)",
                  borderRadius: "14px",
                  minWidth: "100px",
                }}
              >
                {schoolLevel}
                <Image
                  src="/images/icon/school-toggle.svg"
                  alt="열기"
                  width={16}
                  height={16}
                  style={{ width: 16, height: 16, flexShrink: 0 }}
                  className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <div
                  className="absolute right-0 top-[50px] z-10 w-full flex flex-col overflow-hidden bg-brand-black-800"
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.55)",
                    borderRadius: "14px",
                  }}
                >
                  {schoolLevels.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => {
                        setSchoolLevel(level);
                        setIsOpen(false);
                      }}
                      className="text-white/55 text-sm px-4 py-3 text-left hover:bg-white/5 transition-colors"
                    >
                      {level}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-white/40 pl-[14px]">
            시험당일 재학생분들의 시험을 응원해드려요.{" "}
            <span className="text-brand-green-200">(필수 X)</span>
          </p>
        </div>

        {/* 안내 문구 */}
        <p className="text-sm text-white/55">
          범딧불을 이용 하시기 전에 미리 확인할 내용이 남아 있어요.
        </p>

        <Button type="submit" variant="primary" onClick={handleSubmit}>
          다음으로
        </Button>
      </div>

      {/* 페이지 표시 */}
      <p className="text-sm text-right">
        <span className="text-white">1</span>
        <span className="text-white/55">/2</span>
      </p>
    </div>
  );
}
