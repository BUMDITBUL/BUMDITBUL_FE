
"use client";

import { useEffect, useRef } from "react";

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
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useRef(`modal-title-${Math.random().toString(36).substr(2, 9)}`);
  const descId = useRef(`modal-desc-${Math.random().toString(36).substr(2, 9)}`);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Save previous focus
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Lock body scroll
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus primary action
    confirmButtonRef.current?.focus();

    // ESC key handler
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handler);

    return () => {
      // Restore body scroll
      document.body.style.overflow = previousOverflow;

      // Restore focus
      previousActiveElement.current?.focus();

      document.removeEventListener("keydown", handler);
    };
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId.current}
        aria-describedby={description ? descId.current : undefined}
        className="flex flex-col gap-6 rounded-2xl p-8 w-full"
        style={{ maxWidth: "380px", background: "var(--color-surface)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col gap-2">
          <h2 id={titleId.current} className="text-white font-bold text-lg">{title}</h2>
          {description && (
            <p id={descId.current} className="text-white/50 text-sm leading-relaxed">{description}</p>
          )}
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            ref={confirmButtonRef}
            type="button"
            onClick={onConfirm}
            className="w-full text-white text-sm font-medium hover:opacity-90 transition-opacity bg-brand-green-400"
            style={{ height: "46px", borderRadius: "14px" }}
          >
            {confirmLabel}
          </button>
          <button
            type="button"
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
