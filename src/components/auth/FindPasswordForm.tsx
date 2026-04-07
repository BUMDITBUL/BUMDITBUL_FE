'use client'

import { useState } from 'react';
import Input from '@/components/ui/Input';

export default function FindPasswordForm() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [codeError, setCodeError] = useState('');

  const handleSendCode = () => {
    if (!email) {
      setEmailError('이메일을 입력해주세요.');
      return;
    }
    setEmailError('');
    setCodeSent(true);
    setCodeError('');
  };

  const handleVerifyCode = () => {
    if (!code) {
      setCodeError('인증번호를 다시 확인해주세요.');
      return;
    }
    setCodeError('');
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 로고 + 타이틀 */}
      <div className="flex flex-col gap-3">
        <img src="/images/logo.svg" alt="범딧불 로고" className="w-10 h-10" />
        <div className="flex flex-col gap-1">
          <h1 className="text-white text-2xl font-bold">비밀번호 찾기</h1>
          <p className="text-sm leading-relaxed text-white/55">
            이메일을 입력하시고, 인증번호를 작성 해주세요.
          </p>
        </div>
      </div>

      {/* 폼 */}
      <div className="flex flex-col gap-3">
        {/* 이메일 */}
        <div className="flex flex-col gap-1">
          <Input
            type="email"
            placeholder="이메일을 입력해주세요."
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError('');
            }}
            error={!!emailError}
          />
          {emailError && (
            <p className="text-xs text-red-400">{emailError}</p>
          )}
        </div>

        {/* 인증번호 */}
        <div className="flex flex-col gap-1">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="인증번호를 입력해주세요."
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setCodeError('');
                }}
                error={!!codeError}
              />
            </div>
            <button
              type="button"
              onClick={handleSendCode}
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
          {codeSent && !codeError && (
            <p className="text-xs text-white/55">입력하신 이메일로 인증코드를 전송했어요.</p>
          )}
          {codeError && (
            <p className="text-xs text-red-400">{codeError}</p>
          )}
        </div>
      </div>

      {/* 로그인하기 */}
      <a href="/login" className="text-sm underline text-white">
        로그인하기
      </a>
    </div>
  );
}