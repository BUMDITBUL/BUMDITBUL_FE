"use client";

import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import { canRegen, incrementRegenCount, MAX_DAILY_REGEN, remainingRegen } from "@/lib/planRegen";

interface SaveButtonProps {
  title?: string;
  description?: string;
  onSave: () => void | Promise<void>;
  withRegenLimit?: boolean;
}

export default function SaveButton({
  title = "저장하시겠습니까?",
  description,
  onSave,
  withRegenLimit = false,
}: SaveButtonProps) {
  const [open, setOpen] = useState(false);
  const [limitExceeded, setLimitExceeded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    if (withRegenLimit && !canRegen()) {
      setLimitExceeded(true);
      return;
    }
    setOpen(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      if (withRegenLimit) incrementRegenCount();
      await onSave();
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const regenDescription = withRegenLimit
    ? `${description ?? ""}\n오늘 재생성 남은 횟수: ${remainingRegen()}/${MAX_DAILY_REGEN}회`.trim()
    : description;

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full text-white text-sm font-medium hover:opacity-90 transition-opacity bg-brand-green-400 disabled:opacity-60"
        style={{ height: "46px", borderRadius: "14px" }}
      >
        저장
      </button>

      {limitExceeded && (
        <ConfirmModal
          title="오늘 재생성 횟수를 모두 사용했어요."
          description={`하루 최대 ${MAX_DAILY_REGEN}회까지 일정을 재생성할 수 있어요. 내일 다시 시도해주세요.`}
          confirmLabel="확인"
          cancelLabel="닫기"
          onConfirm={() => setLimitExceeded(false)}
          onCancel={() => setLimitExceeded(false)}
        />
      )}

      {open && (
        <ConfirmModal
          title={title}
          description={error || regenDescription}
          onConfirm={handleConfirm}
          onCancel={() => { setOpen(false); setError(null); }}
        />
      )}
    </>
  );
}
