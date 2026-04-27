"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/auth.schema";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/button";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    // TODO: API 연동
    console.log(data);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 로고 + 타이틀 */}
      <div className="flex flex-col gap-3">
        <Image src="/images/logo.svg" alt="범딧불 로고" width={40} height={40} />
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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* 이메일 */}
        <div className="flex flex-col gap-2">
          <label className="text-white/55 text-sm font-medium">이메일</label>
          <Input
            type="email"
            placeholder="이메일 입력"
            error={!!errors.email}
            {...register("email")}
          />
          {errors.email && <ErrorMessage message={errors.email.message!} />}
        </div>

        {/* 비밀번호 */}
        <div className="flex flex-col gap-2">
          <label className="text-white/55 text-sm font-medium">비밀번호</label>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호 입력"
            error={!!errors.password}
            {...register("password")}
            rightElement={
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                <Image
                  src={showPassword ? "/images/icon/open-eyes.svg" : "/images/icon/close-eyes.svg"}
                  alt={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                  width={20}
                  height={20}
                  className="opacity-55"
                />
              </button>
            }
          />
          {errors.password && <ErrorMessage message={errors.password.message!} />}
        </div>

        <Button type="submit" variant="primary">
          로그인
        </Button>
      </form>

      {/* SNS 로그인 */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/55" />
          <span className="text-xs text-white/55">sns로 로그인</span>
          <div className="flex-1 h-px bg-white/55" />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" fullWidth={false}>
            <Image src="/images/google.svg" alt="Google" width={16} height={16} style={{ width: 16, height: 16, flexShrink: 0 }} className="opacity-55" />
            Google
          </Button>
          <Button variant="outline" fullWidth={false}>
            <Image src="/images/apple.svg" alt="Apple" width={16} height={16} style={{ width: 16, height: 16, flexShrink: 0 }} className="opacity-55" />
            Apple
          </Button>
        </div>
      </div>

      {/* 하단 링크 */}
      <div className="flex flex-col gap-1">
        <Link href="/find-password" className="text-sm underline text-white">
          비밀번호를 잊어 버리셨나요?
        </Link>
        <p className="text-sm text-white/55">
          아직 계정이 없어요.{" "}
          <Link href="/signup" className="underline text-white">
            회원가입하기
          </Link>
        </p>
      </div>
    </div>
  );
}
