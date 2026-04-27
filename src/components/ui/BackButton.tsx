"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "./ConfirmModal";

interface BackButtonProps {
  href: string;
}

export default function BackButton({ href }: BackButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors w-fit"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        뒤로가기
      </button>

      {showConfirm && (
        <ConfirmModal
          title="저장하지 않고 나가시겠습니까?"
          description="작성 중인 내용이 저장되지 않습니다."
          confirmLabel="나가기"
          cancelLabel="계속 편집"
          onConfirm={() => router.push(href)}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
