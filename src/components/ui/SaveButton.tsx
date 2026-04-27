"use client";

import { useState } from "react";
import ConfirmModal from "./ConfirmModal";

interface SaveButtonProps {
  title?: string;
  description?: string;
  onSave: () => void | Promise<void>;
}

export default function SaveButton({
  title = "저장하시겠습니까?",
  description,
  onSave,
}: SaveButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await onSave();
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full text-white text-sm font-medium hover:opacity-90 transition-opacity bg-brand-green-400"
        style={{ height: "46px", borderRadius: "14px" }}
      >
        저장
      </button>

      {open && (
        <ConfirmModal
          title={title}
          description={error || description}
          onConfirm={handleConfirm}
          onCancel={() => setOpen(false)}
        />
      )}
    </>
  );
}
