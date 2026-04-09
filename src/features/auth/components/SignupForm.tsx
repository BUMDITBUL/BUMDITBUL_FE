'use client'

import Image from 'next/image';
import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-1">
      <Image src="/images/icon/error.svg" alt="에러" width={16} height={16} />
      <p className="text-xs text-brand-error">{message}</p>
    </div>
  );
}

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');
  const [codeError, setCodeError] = useState('');

  const validatePassword = (value: string) => {
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return passwordRegex.test(value);
  };

  const handleSendCode = () => {
    setCodeSent(true);
    setCodeError('');
  };

  const handleSubmit = () => {
    let hasError = false;

    if (!validatePassword(password)) {
      setPasswordError('비밀번호 형식이 올바르지 않습니다.');
      hasError = true;
    }

    if (password !== passwordConfirm) {
      setPasswordConfirmError('비밀번호가 일치하지 않습니다.');
      hasError = true;
    }

    if (!code) {
      setCodeError('인증번호를 다시 확인해주세요.');
      hasError = true;
    }

    if (hasError) return;
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
      <div className="flex flex-col gap-4">
        {/* 이메일 */}
        <div className="flex flex-col gap-2">
          <label className="text-white/55 text-sm font-medium">이메일</label>
          <Input
            type="email"
            placeholder="이메일을 입력해주세요."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* 인증번호 */}
        <div className="flex flex-col gap-2">
          <label className="text-white/55 text-sm font-medium">인증번호</label>
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="인증번호를 입력해주세요."
                  value={code}
                  onChange={(e) => { setCode(e.target.value); setCodeError(''); }}
                  error={!!codeError}
                />
              </div>
              <button
                type="button"
                onClick={handleSendCode}
                className="shrink-0 px-5 text-white/55 text-sm transition-colors hover:bg-white/5"
                style={{
                  height: "46px",
                  border: "1px solid rgba(255, 255, 255, 0.55)",
                  borderRadius: "14px",
                }}
              >
                확인
              </button>
            </div>
            {codeSent && !codeError && (
              <p className="text-xs text-white/55">입력하신 이메일로 인증번호를 전송했어요.</p>
            )}
            {codeError && <ErrorMessage message={codeError} />}
          </div>
        </div>

        {/* 비밀번호 */}
        <div className="flex flex-col gap-2">
          <label className="text-white/55 text-sm font-medium">비밀번호</label>
          <div className="flex flex-col gap-1">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="8자 이상 특수문자를 포함하여 입력"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
              error={!!passwordError}
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
            {passwordError && <ErrorMessage message="비밀번호는 8자 이상, 특수문자를 포함해야 합니다." />}
          </div>
        </div>

        {/* 비밀번호 확인 */}
        <div className="flex flex-col gap-2">
          <label className="text-white/55 text-sm font-medium">비밀번호 확인</label>
          <div className="flex flex-col gap-1">
            <Input
              type={showPasswordConfirm ? "text" : "password"}
              placeholder="8자 이상 특수문자를 포함하여 입력"
              value={passwordConfirm}
              onChange={(e) => { setPasswordConfirm(e.target.value); setPasswordConfirmError(''); }}
              error={!!passwordConfirmError}
              rightElement={
                <button type="button" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}>
                  <Image
                    src={showPasswordConfirm ? "/images/icon/open-eyes.svg" : "/images/icon/close-eyes.svg"}
                    alt={showPasswordConfirm ? "비밀번호 숨기기" : "비밀번호 보기"}
                    width={20}
                    height={20}
                    className="opacity-55"
                  />
                </button>
              }
            />
            {passwordConfirmError && <ErrorMessage message={passwordConfirmError} />}
          </div>
        </div>

        <Button type="submit" variant="primary" onClick={handleSubmit}>회원가입</Button>
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
      <p className="text-sm text-white/55">
        이미 계정이 있어요.{" "}
        <a href="/login" className="underline text-white">
          로그인하기
        </a>
      </p>
    </div>
  );
}
