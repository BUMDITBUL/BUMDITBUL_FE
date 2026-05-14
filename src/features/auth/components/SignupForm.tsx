'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormValues } from '@/features/auth/schemas/auth.schema';
import { sendEmail, signup, verifyEmail } from '@/features/auth/api/auth.api';
import { ApiError } from '@/lib/api';
import { saveAuthTokens } from '@/lib/authTokens';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/button';

export default function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [sendCodeMessage, setSendCodeMessage] = useState<string | null>(null);
  const [sendCodeError, setSendCodeError] = useState<string | null>(null);
  const [verifyCodeMessage, setVerifyCodeMessage] = useState<string | null>(null);
  const [verifyCodeError, setVerifyCodeError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    if (!isEmailVerified) {
      setSubmitError('이메일 인증을 완료해주세요.');
      return;
    }

    setSubmitError(null);

    try {
      const tokens = await signup({ email: data.email, password: data.password });
      saveAuthTokens(tokens);
      router.push('/onboarding');
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setSubmitError('이미 가입된 이메일입니다.');
        return;
      }
      setSubmitError(error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.');
    }
  };

  const handleSendCode = async () => {
    const isEmailValid = await trigger('email');

    if (!isEmailValid) {
      return;
    }

    setIsSendingCode(true);
    setSendCodeMessage(null);
    setSendCodeError(null);
    setVerifyCodeMessage(null);
    setVerifyCodeError(null);

    try {
      const response = await sendEmail(getValues('email'));

      if (response.isDuplicate) {
        setCodeSent(false);
        setSendCodeError('이미 가입된 이메일입니다.');
        return;
      }

      setCodeSent(true);
      setSendCodeMessage(response.message || '입력하신 이메일로 인증번호를 전송했어요.');
    } catch (error) {
      setCodeSent(false);
      setSendCodeError(error instanceof Error ? error.message : '인증번호 전송 중 오류가 발생했습니다.');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    const isEmailValid = await trigger('email');
    const isCodeValid = await trigger('verificationCode');

    if (!isEmailValid || !isCodeValid) {
      return;
    }

    setIsVerifyingCode(true);
    setVerifyCodeMessage(null);
    setVerifyCodeError(null);

    try {
      const response = await verifyEmail(getValues('email'), getValues('verificationCode'));

      if (!response.verified) {
        setVerifyCodeError('인증번호가 일치하지 않습니다.');
        return;
      }

      setIsEmailVerified(true);
      setVerifyCodeMessage('이메일 인증이 완료되었어요.');
    } catch (error) {
      setVerifyCodeError(error instanceof Error ? error.message : '인증번호 확인 중 오류가 발생했습니다.');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 로고 + 타이틀 */}
      <div className="flex flex-col gap-3">
        <Image src="/images/logo.svg" alt="범딧불 로고" width={40} height={40} />
        <div className="flex flex-col gap-1">
          <h1 className="text-white text-2xl font-bold">범딧불과 함께하기</h1>
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
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="이메일을 입력해주세요."
                error={!!errors.email}
                {...register('email')}
              />
            </div>
            <button
              type="button"
              onClick={handleSendCode}
              disabled={isSendingCode}
              className="shrink-0 px-5 text-white/55 text-sm transition-colors hover:bg-white/5"
              style={{
                height: "46px",
                border: "1px solid rgba(255, 255, 255, 0.55)",
                borderRadius: "14px",
              }}
            >
              {isSendingCode ? '전송 중' : '전송'}
            </button>
          </div>
          {errors.email && <ErrorMessage message={errors.email.message!} />}
          {sendCodeError && <ErrorMessage message={sendCodeError} />}
        </div>

        {/* 인증번호 */}
        <div className="flex flex-col gap-2">
          <label className="text-white/55 text-sm font-medium">인증번호</label>
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="인증번호를 입력해주세요."
                  error={!!errors.verificationCode}
                  {...register('verificationCode')}
                />
              </div>
              <button
                type="button"
                onClick={handleVerifyCode}
                disabled={isVerifyingCode}
                className="shrink-0 px-5 text-white/55 text-sm transition-colors hover:bg-white/5"
                style={{
                  height: "46px",
                  border: "1px solid rgba(255, 255, 255, 0.55)",
                  borderRadius: "14px",
                }}
              >
                {isVerifyingCode ? '확인 중' : '확인'}
              </button>
            </div>
            {codeSent && sendCodeMessage && !errors.verificationCode && (
              <p className="text-xs text-white/55">{sendCodeMessage}</p>
            )}
            {errors.verificationCode && <ErrorMessage message={errors.verificationCode.message!} />}
            {verifyCodeMessage && <p className="text-xs text-brand-green-200">{verifyCodeMessage}</p>}
            {verifyCodeError && <ErrorMessage message={verifyCodeError} />}
          </div>
        </div>

        {/* 비밀번호 */}
        <div className="flex flex-col gap-2">
          <label className="text-white/55 text-sm font-medium">비밀번호</label>
          <div className="flex flex-col gap-1">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="8자 이상 특수문자를 포함하여 입력"
              error={!!errors.password}
              {...register('password')}
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
        </div>

        {/* 비밀번호 확인 */}
        <div className="flex flex-col gap-2">
          <label className="text-white/55 text-sm font-medium">비밀번호 확인</label>
          <div className="flex flex-col gap-1">
            <Input
              type={showPasswordConfirm ? "text" : "password"}
              placeholder="8자 이상 특수문자를 포함하여 입력"
              error={!!errors.passwordConfirm}
              {...register('passwordConfirm')}
              rightElement={
                <button type="button" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}>
                  <Image
                    src={showPasswordConfirm ? "/images/icon/open-eyes.svg" : "/images/icon/close-eyes.svg"}
                    alt={showPasswordConfirm ? "비밀번호 숨기기" : "비밀번호 보기"}
                    width={20}
                    height={20}
                    className="opacity-55"
              unoptimized
            />
                </button>
              }
            />
            {errors.passwordConfirm && <ErrorMessage message={errors.passwordConfirm.message!} />}
          </div>
        </div>

        {submitError && <ErrorMessage message={submitError} />}

        <Button type="submit" variant="primary" className="mt-4" disabled={isSubmitting}>
          {isSubmitting ? '가입 중...' : '회원가입'}
        </Button>
      </form>

      {/* 하단 링크 */}
      <p className="text-sm text-white/55">
        이미 계정이 있어요.{" "}
        <Link href="/login" className="underline text-white">
          로그인하기
        </Link>
      </p>
    </div>
  );
}
