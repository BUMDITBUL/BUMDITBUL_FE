"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleSubmit = () => {
    if (!email || !password) {
      setLoginError("이메일 또는 비밀번호가 올바르지 않습니다.");
      return;
    }
    setLoginError("");
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 로고 + 타이틀 */}
      <div className="flex flex-col gap-3">
        <img src="/images/logo.svg" alt="범딧불 로고" className="w-10 h-10" />
        <div className="flex flex-col gap-1">
          <h1 className="text-white text-2xl font-bold">범딧불에 로그인</h1>
          <p className="text-sm leading-relaxed text-brand-black-500">
            범딧불은 언제나 공부에 열중하시는
            <br />
            여러분들을 <span className="text-brand-green-200">응원</span>하고,{" "}
            <span className="text-brand-green-200">환영</span>합니다.
          </p>
        </div>
      </div>

      {/* 폼 */}
      <div className="flex flex-col gap-4">
        {/* 이메일 */}
        <div className="flex flex-col gap-2">
          <label className="text-white text-sm font-medium">이메일</label>
          <Input
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setLoginError(""); }}
            error={!!loginError}
          />
        </div>

        {/* 비밀번호 */}
        <div className="flex flex-col gap-2">
          <label className="text-white text-sm font-medium">비밀번호</label>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setLoginError(""); }}
            error={!!loginError}
            rightElement={
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                <img
                  src={showPassword ? "/images/icon/open-eyes.svg" : "/images/icon/close-eyes.svg"}
                  alt={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                  className="w-5 h-5 opacity-55"
                />
              </button>
            }
          />
        </div>

        {/* 에러 메시지 */}
        {loginError && (
          <div className="flex items-center gap-1">
            <img src="/images/icon/error.svg" alt="에러" className="w-4 h-4" />
            <p className="text-xs text-brand-error">{loginError}</p>
          </div>
        )}

        <Button type="submit" variant="primary" onClick={handleSubmit}>
          로그인
        </Button>
      </div>

      {/* SNS 로그인 */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/55" />
          <span className="text-xs text-white/55">sns로 로그인</span>
          <div className="flex-1 h-px bg-white/55" />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" fullWidth={false}>
            <img src="/images/google.svg" alt="Google" className="w-4 h-4 opacity-55" />
            Google
          </Button>
          <Button variant="outline" fullWidth={false}>
            <img src="/images/apple.svg" alt="Apple" className="w-4 h-4 opacity-55" />
            Apple
          </Button>
        </div>
      </div>

      {/* 하단 링크 */}
      <div className="flex flex-col gap-1">
        <a href="/find-password" className="text-sm underline text-white">
          비밀번호를 잊어 버리셨나요?
        </a>
        <p className="text-sm text-white/55">
          아직 계정이 없어요.{" "}
          <a href="/signup" className="underline text-white">
            회원가입하기
          </a>
        </p>
      </div>
    </div>
  );
}