"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { EXAM_DATE } from "@/constants/config";

const STORAGE_KEY = "exam_day_modal_shown";

function isExamDay(examDate: Date) {
  const today = new Date();
  return (
    today.getFullYear() === examDate.getFullYear() &&
    today.getMonth() === examDate.getMonth() &&
    today.getDate() === examDate.getDate()
  );
}

function shouldShow(examDate: Date) {
  if (!isExamDay(examDate)) return false;
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) !== new Date().toDateString();
}

export default function ExamDayModal({ examDate = EXAM_DATE }: { examDate?: Date }) {
  const [open, setOpen] = useState(() => shouldShow(examDate));
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) buttonRef.current?.focus();
  }, [open]);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, new Date().toDateString());
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={handleClose}
    >
      <div
        className="flex flex-col items-center gap-6 rounded-2xl p-8 w-full text-center"
        style={{ maxWidth: "380px", background: "var(--color-surface)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image src="/images/logo.svg" alt="범딧불 로고" width={36} height={36} />

        {/* D-DAY */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-white/40 text-xs font-medium tracking-widest">TODAY</span>
          <span
            className="text-white font-bold"
            style={{ fontSize: "72px", lineHeight: 1, letterSpacing: "-0.02em" }}
          >
            D-DAY
          </span>
        </div>

        {/* 메시지 */}
        <div className="flex flex-col gap-1.5">
          <p className="text-white font-semibold text-base leading-snug">
            범딧불은 언제나 여러분의<br />시험을 응원합니다.
          </p>
          <p className="text-white/50 text-sm leading-relaxed">
            지금까지 열심히 달려온 여러분,<br />오늘 하루도 최선을 다해봐요.
          </p>
        </div>

        <button
          ref={buttonRef}
          type="button"
          onClick={handleClose}
          className="w-full text-white text-sm font-medium hover:opacity-90 transition-opacity bg-brand-green-400"
          style={{ height: "46px", borderRadius: "14px" }}
        >
          파이팅!
        </button>
      </div>
    </div>
  );
}
