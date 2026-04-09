"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function FindPasswordResult() {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col gap-10">
      {/* 로고 + 타이틀 */}
      <div className="flex flex-col gap-3">
        <Image src="/images/logo.svg" alt="범딧불 로고" width={40} height={40} />
        <div className="flex flex-col gap-1">
          <h1 className="text-white text-2xl font-bold">비밀번호 찾기</h1>
          <p className="text-sm text-white/55">{"{userName}"}님의 비밀번호는</p>
        </div>
      </div>

      {/* 비밀번호 표시 */}
      <div className="flex items-baseline gap-2">
        <span className="text-white text-4xl font-bold">ABCD1234!</span>
        <span className="text-white/55 text-sm">입니다.</span>
      </div>

      {/* 버튼 */}
      <Button variant="primary" onClick={() => router.push("/login")}>
        다시 로그인하기
      </Button>
    </div>
  );
}
