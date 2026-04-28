"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LONG_PRESS_DURATION, DELETE_ANIMATION_DURATION } from "@/constants/config";
import PlanStatusPanel from "@/components/ui/PlanStatusPanel";

type SubItem = {
  id: number;
  material: string;
  pages: string;
  checked: boolean;
};

type StudyItem = {
  id: number;
  subject: string;
  subItems: SubItem[];
};

type DraftSub = { material: string; pages: string };

const initialItems: StudyItem[] = [
  {
    id: 1, subject: "수학",
    subItems: [
      { id: 11, material: "교과서", pages: "96 ~ 106p", checked: true },
      { id: 12, material: "문제집", pages: "45 ~ 50p", checked: false },
    ],
  },
  {
    id: 2, subject: "영어",
    subItems: [
      { id: 21, material: "학습지", pages: "11 ~ 15p", checked: false },
    ],
  },
  {
    id: 3, subject: "과학",
    subItems: [
      { id: 31, material: "교과서", pages: "95 ~ 106p", checked: false },
      { id: 32, material: "평가문제", pages: "전범위", checked: false },
    ],
  },
];

function CircleEmpty() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <circle cx="7" cy="7" r="6.5" stroke="rgba(255,255,255,0.25)" />
    </svg>
  );
}

function CircleCheck({ checked }: { checked: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
      {checked ? (
        <>
          <circle cx="7" cy="7" r="6.5" fill="var(--color-brand-green-400)" />
          <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <circle cx="7" cy="7" r="6.5" stroke="rgba(255,255,255,0.25)" />
      )}
    </svg>
  );
}

interface StudyPanelProps {
  planStatus?: "setup" | "generating" | "error";
  userName?: string;
  selectedDate?: Date;
}

export default function StudyPanel({ planStatus, userName, selectedDate }: StudyPanelProps = {}) {
  const today = new Date();
  const isToday =
    !selectedDate ||
    (selectedDate.getFullYear() === today.getFullYear() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getDate() === today.getDate());

  const panelTitle = isToday
    ? "오늘 할 공부"
    : `${selectedDate!.getMonth() + 1}월 ${selectedDate!.getDate()}일 할 공부`;
  const [items, setItems] = useState(initialItems);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [draftSubject, setDraftSubject] = useState("");
  const [draftSubs, setDraftSubs] = useState<DraftSub[]>([{ material: "", pages: "" }]);
  const [subjectError, setSubjectError] = useState(false);

  const itemIdCounter = useRef(10);
  const subIdCounter = useRef(100);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const removalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);
  const subjectRef = useRef<HTMLInputElement>(null);
  const materialRefs = useRef<Map<string | number, HTMLInputElement | null>>(new Map());
  const pagesRefs = useRef<Map<string | number, HTMLInputElement | null>>(new Map());

  const toggleSub = (itemId: number, subId: number) => {
    if (isLongPress.current) return;
    setItems(prev => prev.map(item =>
      item.id !== itemId ? item : {
        ...item,
        subItems: item.subItems.map(s => s.id === subId ? { ...s, checked: !s.checked } : s),
      }
    ));
  };

  const toggleAll = (itemId: number) => {
    if (isLongPress.current) return;
    setItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      const allDone = item.subItems.every(s => s.checked);
      return { ...item, subItems: item.subItems.map(s => ({ ...s, checked: !allDone })) };
    }));
  };

  const handleLongPressStart = (itemId: number) => {
    isLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      setRemovingId(itemId);
      removalTimerRef.current = setTimeout(() => {
        setItems(prev => prev.filter(i => i.id !== itemId));
        setRemovingId(null);
        isLongPress.current = false;
      }, DELETE_ANIMATION_DURATION);
    }, LONG_PRESS_DURATION);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (removalTimerRef.current) {
      clearTimeout(removalTimerRef.current);
      removalTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
      if (removalTimerRef.current) clearTimeout(removalTimerRef.current);
    };
  }, []);

  const startAdding = () => {
    setDraftSubject("");
    setDraftSubs([{ material: "", pages: "" }]);
    setSubjectError(false);
    setIsAdding(true);
    requestAnimationFrame(() => subjectRef.current?.focus());
  };

  const updateDraftSub = (i: number, field: keyof DraftSub, value: string) => {
    setDraftSubs(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  };

  const addDraftRow = (focusIndex: number) => {
    setDraftSubs(prev => [...prev, { material: "", pages: "" }]);
    requestAnimationFrame(() => materialRefs.current.get(focusIndex)?.focus());
  };

  const confirmAdd = () => {
    const subject = draftSubject.trim();
    if (!subject) {
      setSubjectError(true);
      return;
    }
    setSubjectError(false);
    const subItems = draftSubs
      .filter(s => s.material.trim())
      .map(s => ({ id: subIdCounter.current++, material: s.material.trim(), pages: s.pages.trim(), checked: false }));
    setItems(prev => [...prev, { id: itemIdCounter.current++, subject, subItems }]);
    cancelAdd();
  };

  const cancelAdd = () => {
    setIsAdding(false);
    setDraftSubject("");
    setDraftSubs([{ material: "", pages: "" }]);
    setSubjectError(false);
    materialRefs.current.clear();
    pagesRefs.current.clear();
  };

  if (planStatus === "setup") {
    return (
      <div
        className="flex flex-col gap-5 items-center justify-center rounded-2xl shrink-0 h-full px-8 text-center"
        style={{ width: "360px", background: "var(--color-surface)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex flex-col gap-1.5">
          <p className="text-white font-semibold text-base">아직 일정이 없어요.</p>
          <p className="text-white/45 text-sm leading-relaxed">
            과목 성적과 시험 범위를 입력하면<br />맞춤 학습 일정을 만들어드려요.
          </p>
        </div>
        <div className="w-full flex flex-col gap-2.5">
          <Link
            href="/profile/subject-grade"
            className="w-full flex items-center justify-center text-sm text-white/70 hover:bg-white/5 transition-colors"
            style={{ height: "46px", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "14px" }}
          >
            과목별 성적 입력
          </Link>
          <Link
            href="/profile/exam-range"
            className="w-full flex items-center justify-center text-sm font-medium text-white hover:opacity-90 transition-opacity bg-brand-green-400"
            style={{ height: "46px", borderRadius: "14px" }}
          >
            일정 생성하기
          </Link>
        </div>
      </div>
    );
  }

  if (planStatus === "generating" || planStatus === "error") {
    return (
      <div className="flex flex-col shrink-0 h-full" style={{ width: "360px" }}>
        <PlanStatusPanel status={planStatus} userName={userName} />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-4 rounded-2xl p-6 shrink-0 h-full"
      style={{ width: "360px", background: "var(--color-surface)" }}
    >
      <h2 className="text-white font-semibold text-base">{panelTitle}</h2>

      <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
        {items.map(item => {
          const allDone = item.subItems.every(s => s.checked);
          return (
            <div
              key={item.id}
              className="flex flex-col rounded-xl px-4 py-3 gap-2.5 transition-opacity duration-200 select-none"
              style={{ background: "var(--color-surface-elevated)", opacity: removingId === item.id ? 0 : 1 }}
              onPointerDown={() => handleLongPressStart(item.id)}
              onPointerUp={handleLongPressEnd}
              onPointerLeave={handleLongPressEnd}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">{item.subject}</span>
                <button
                  onPointerDown={e => e.stopPropagation()}
                  onClick={() => toggleAll(item.id)}
                  className="shrink-0 p-1"
                >
                  <Image
                    src={allDone ? "/images/icon/check_active.svg" : "/images/icon/check_default.svg"}
                    alt={allDone ? "완료" : "미완료"}
                    width={20}
                    height={20}
                  />
                </button>
              </div>
              <div className="flex flex-col gap-1.5 pl-0.5">
                {item.subItems.map(sub => (
                  <button
                    key={sub.id}
                    type="button"
                    onPointerDown={e => e.stopPropagation()}
                    onClick={() => toggleSub(item.id, sub.id)}
                    className="flex items-center gap-2 text-left"
                  >
                    <CircleCheck checked={sub.checked} />
                    <span className={`text-xs leading-none ${sub.checked ? "line-through text-white/30" : "text-white/55"}`}>
                      {sub.material} {sub.pages}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {/* 인라인 추가 카드 */}
        {isAdding && (
          <div
            className="flex flex-col rounded-xl px-4 py-3 gap-2.5"
            style={{ background: "var(--color-surface-elevated)" }}
          >
            <div className="flex items-center justify-between">
              <input
                ref={subjectRef}
                value={draftSubject}
                onChange={e => setDraftSubject(e.target.value)}
                onKeyDown={e => {
                  if (e.nativeEvent.isComposing) return;
                  if (e.key === "Enter") { e.preventDefault(); materialRefs.current.get(0)?.focus(); }
                  if (e.key === "Escape") cancelAdd();
                }}
                placeholder="과목명"
                className="bg-transparent text-sm font-medium text-white placeholder:text-white/25 outline-none flex-1"
              />
              <button onClick={cancelAdd} className="text-white/30 hover:text-white/60 transition-colors text-base leading-none ml-2">×</button>
            </div>

            <div className="flex flex-col gap-1.5 pl-0.5">
              {draftSubs.map((sub, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CircleEmpty />
                  <input
                    ref={el => { materialRefs.current.set(i, el); }}
                    value={sub.material}
                    onChange={e => updateDraftSub(i, "material", e.target.value)}
                    onKeyDown={e => {
                      if (e.nativeEvent.isComposing) return;
                      if (e.key === "Enter") { e.preventDefault(); pagesRefs.current.get(i)?.focus(); }
                    }}
                    placeholder="자료명"
                    className="bg-transparent text-xs text-white/70 placeholder:text-white/25 outline-none w-16"
                  />
                  <input
                    ref={el => { pagesRefs.current.set(i, el); }}
                    value={sub.pages}
                    onChange={e => updateDraftSub(i, "pages", e.target.value)}
                    onKeyDown={e => {
                      if (e.nativeEvent.isComposing) return;
                      if (e.key === "Enter") { e.preventDefault(); addDraftRow(i + 1); }
                    }}
                    placeholder="범위 · 내용"
                    className="bg-transparent text-xs text-white/50 placeholder:text-white/20 outline-none flex-1"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={confirmAdd}
              className="text-xs text-brand-green-400 hover:opacity-70 transition-opacity text-left pl-5 pt-0.5"
            >
              저장
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button onClick={startAdding} className="hover:opacity-70 transition-opacity">
          <Image src="/images/icon/plus.svg" alt="추가" width={24} height={24} />
        </button>
      </div>
    </div>
  );
}
