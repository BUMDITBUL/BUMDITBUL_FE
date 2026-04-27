"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "./ConfirmModal";

interface BackButtonProps {
  href: string;
  isDirty?: boolean;
}

export default function BackButton({ href, isDirty = true }: BackButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = () => {
    if (isDirty) {
      setShowConfirm(true);
    } else {
      router.push(href);
    }
  };

  const handleConfirm = useCallback(() => {
    router.push(href);
  }, [router, href]);

  const handleCancel = useCallback(() => {
    setShowConfirm(false);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
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
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
