'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  findPasswordEmailSchema,
  findPasswordCodeSchema,
  type FindPasswordEmailValues,
  type FindPasswordCodeValues,
} from '@/features/auth/schemas/auth.schema';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Input from '@/components/ui/Input';

export default function FindPasswordForm() {
  const [codeSent, setCodeSent] = useState(false);

  const emailForm = useForm<FindPasswordEmailValues>({
    resolver: zodResolver(findPasswordEmailSchema),
  });

  const codeForm = useForm<FindPasswordCodeValues>({
    resolver: zodResolver(findPasswordCodeSchema),
  });

  const onSendCode = (_data: FindPasswordEmailValues) => {
    // TODO: API 연동
    setCodeSent(true);
  };

  const onVerifyCode = (_data: FindPasswordCodeValues) => {
    // TODO: API 연동
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 로고 + 타이틀 */}
      <div className="flex flex-col gap-3">
        <Image src="/images/logo.svg" alt="범딧불 로고" width={40} height={40} />
        <div className="flex flex-col gap-1">
          <h1 className="text-white text-2xl font-bold">비밀번호 찾기</h1>
          <p className="text-sm leading-relaxed text-white/55">
            이메일을 입력하시고, 인증코드를 작성 해주세요.
          </p>
        </div>
      </div>

      {/* 폼 */}
      <div className="flex flex-col gap-4">
        {/* 이메일 + 전송 버튼 */}
        <form onSubmit={emailForm.handleSubmit(onSendCode)} className="flex flex-col gap-2">
          <label className="text-white/55 text-sm font-medium">이메일</label>
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="이메일을 입력해주세요."
                  error={!!emailForm.formState.errors.email}
                  {...emailForm.register('email')}
                />
              </div>
              <button
                type="submit"
                className="shrink-0 px-6 text-white/55 text-sm transition-colors hover:bg-white/5"
                style={{
                  height: "46px",
                  border: "1px solid rgba(255, 255, 255, 0.55)",
                  borderRadius: "14px",
                }}
              >
                전송
              </button>
            </div>
            {emailForm.formState.errors.email && (
              <ErrorMessage message={emailForm.formState.errors.email.message!} />
            )}
            {codeSent && <p className="text-xs text-white/55">입력하신 이메일로 인증코드를 전송했어요.</p>}
          </div>
        </form>

        {/* 인증번호 + 확인 버튼 */}
        <form onSubmit={codeForm.handleSubmit(onVerifyCode)} className="flex flex-col gap-2">
          <label className="text-white/55 text-sm font-medium">인증번호</label>
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="인증번호를 입력해주세요."
                  error={!!codeForm.formState.errors.code}
                  {...codeForm.register('code')}
                />
              </div>
              <button
                type="submit"
                className="shrink-0 px-6 text-white/55 text-sm transition-colors hover:bg-white/5"
                style={{
                  height: "46px",
                  border: "1px solid rgba(255, 255, 255, 0.55)",
                  borderRadius: "14px",
                }}
              >
                확인
              </button>
            </div>
            {codeForm.formState.errors.code && (
              <ErrorMessage message={codeForm.formState.errors.code.message!} />
            )}
          </div>
        </form>
      </div>

      {/* 로그인하기 */}
      <Link href="/login" className="text-sm underline text-white">
        로그인하기
      </Link>
    </div>
  );
}
