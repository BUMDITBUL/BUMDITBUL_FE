'use client'

import Image from 'next/image';
import { useState } from 'react';
import Input from '@/components/ui/Input';

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-1">
      <Image src="/images/icon/error.svg" alt="에러" width={16} height={16} />
      <p className="text-xs text-brand-error">{message}</p>
    </div>
  );
}

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
        <div className="flex flex-col gap-2">
          <label className="text-white/55 text-sm font-medium">이메일</label>
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="이메일을 입력해주세요."
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                  error={!!emailError}
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
                전송
              </button>
            </div>
            {emailError && <ErrorMessage message={emailError} />}
            {codeSent && <p className="text-xs text-white/55">입력하신 이메일로 인증코드를 전송했어요.</p>}
          </div>
        </div>

        {/* 인증번호 + 확인 버튼 */}
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
                onClick={handleVerifyCode}
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
            {codeError && <ErrorMessage message={codeError} />}
          </div>
        </div>
      </div>

      {/* 로그인하기 */}
      <a href="/login" className="text-sm underline text-white">
        로그인하기
      </a>
    </div>
  );
}
