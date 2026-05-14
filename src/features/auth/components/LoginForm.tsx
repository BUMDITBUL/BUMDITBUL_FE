"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/auth.schema";
import { googleLogin, login } from "@/features/auth/api/auth.api";
import { ApiError } from "@/lib/api";
import { saveAuthTokens } from "@/lib/authTokens";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/button";
import GoogleLoginButton from "@/features/auth/components/GoogleLoginButton";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setSubmitError(null);

    try {
      const tokens = await login(data);
      saveAuthTokens(tokens);
      router.push("/main");
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setSubmitError("이메일 또는 비밀번호를 확인해주세요.");
        return;
      }

      setSubmitError(error instanceof Error ? error.message : "로그인 중 오류가 발생했습니다.");
    }
  };

  const handleGoogleCredential = useCallback(async (idToken: string) => {
    setSubmitError(null);
    setIsGoogleSubmitting(true);

    try {
      const tokens = await googleLogin(idToken);
      saveAuthTokens(tokens);
      router.push("/main");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Google 로그인 중 오류가 발생했습니다.");
    } finally {
      setIsGoogleSubmitting(false);
    }
  }, [router]);

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
              unoptimized
            />
              </button>
            }
          />
          {errors.password && <ErrorMessage message={errors.password.message!} />}
        </div>

        {submitError && <ErrorMessage message={submitError} />}

        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "로그인 중..." : "로그인"}
        </Button>
      </form>

      {/* SNS 로그인 */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/55" />
          <span className="text-xs text-white/55">sns로 시작하기</span>
          <div className="flex-1 h-px bg-white/55" />
        </div>
        <GoogleLoginButton onCredential={handleGoogleCredential} />
        {isGoogleSubmitting && <p className="text-center text-xs text-white/55">Google 로그인 중...</p>}
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
