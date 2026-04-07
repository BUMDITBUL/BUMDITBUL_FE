'use client'

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

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
      <div className="flex flex-col gap-3">
        <Input type="email" placeholder="이메일을 입력해주세요." />
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="비밀번호를 입력해주세요."
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
        <Button type="submit" variant="primary">로그인</Button>
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