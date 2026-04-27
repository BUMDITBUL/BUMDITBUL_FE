"use client";

import { useEffect } from "react";

interface ConfirmModalProps {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  title,
  description,
  confirmLabel = "저장하기",
  cancelLabel = "취소",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onMouseDown={onCancel}
    >
      <div
        className="flex flex-col gap-6 rounded-2xl p-8 w-full"
        style={{ maxWidth: "380px", background: "#2d2d2d" }}
        onMouseDown={e => e.stopPropagation()}
      >
        <div className="flex flex-col gap-2">
          <h2 className="text-white font-bold text-lg">{title}</h2>
          {description && (
            <p className="text-white/50 text-sm leading-relaxed">{description}</p>
          )}
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={onConfirm}
            className="w-full text-white text-sm font-medium hover:opacity-90 transition-opacity bg-brand-green-400"
            style={{ height: "46px", borderRadius: "14px" }}
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="w-full text-white/55 text-sm hover:bg-white/5 transition-colors"
            style={{ height: "46px", border: "1px solid rgba(255,255,255,0.55)", borderRadius: "14px" }}
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
