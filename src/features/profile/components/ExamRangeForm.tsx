"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import ErrorMessage from "@/components/ui/ErrorMessage";

const MAX_SUBJECTS = 9;
const MAX_NAME_LENGTH = 12;
const DIFFICULTIES = ["상", "중", "하"] as const;
const DAYS_KR = ["일", "월", "화", "수", "목", "금", "토"];

type Difficulty = typeof DIFFICULTIES[number];

type Subject = {
  id: number;
  name: string;
  startPage: string;
  endPage: string;
  date: string;
  difficulty: Difficulty;
  materials: string[];
  nameEdited: boolean;
};

let subjectIdCounter = 1;

const DEFAULT_SUBJECTS: Subject[] = [
  { id: 0, name: "", startPage: "", endPage: "", date: "", difficulty: "중", materials: [], nameEdited: false },
];

const INPUT_BASE: React.CSSProperties = {
  height: "42px",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "12px",
};

const INPUT_FOCUS: React.CSSProperties = {
  ...INPUT_BASE,
  border: "1px solid rgba(255, 255, 255, 0.55)",
};

const getNameWidth = (text: string) => Math.max(100, text.length * 14 + 32);

// 날짜 캘린더 피커 
function DatePicker({ value, onChange, onClose }: {
  value: string;
  onChange: (date: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const today = new Date();

  const parseSelected = () => {
    const parts = value.split(".");
    if (parts.length === 3) {
      const y = parseInt(parts[0]), m = parseInt(parts[1]) - 1, d = parseInt(parts[2]);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) return new Date(y, m, d);
    }
    return null;
  };

  const selected = parseSelected();
  const init = selected ?? today;
  const [viewYear, setViewYear] = useState(init.getFullYear());
  const [viewMonth, setViewMonth] = useState(init.getMonth());

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();

  const cells: { day: number; type: "prev" | "current" | "next" }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, type: "prev" });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, type: "current" });
  const rem = cells.length % 7;
  if (rem !== 0) for (let d = 1; d <= 7 - rem; d++) cells.push({ day: d, type: "next" });

  const rows: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  const prevMonth = () => viewMonth === 0 ? (setViewYear(y => y - 1), setViewMonth(11)) : setViewMonth(m => m - 1);
  const nextMonth = () => viewMonth === 11 ? (setViewYear(y => y + 1), setViewMonth(0)) : setViewMonth(m => m + 1);

  const isSel = (day: number, type: string) =>
    selected && type === "current" && day === selected.getDate() && viewYear === selected.getFullYear() && viewMonth === selected.getMonth();
  const isToday = (day: number, type: string) =>
    type === "current" && day === today.getDate() && viewYear === today.getFullYear() && viewMonth === today.getMonth();

  const handleSelect = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    onChange(`${viewYear}.${m}.${d}`);
    onClose();
  };

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 mt-1 z-30 rounded-2xl p-4"
      style={{ background: "#252525", boxShadow: "0 8px 32px rgba(0,0,0,0.5)", minWidth: "268px" }}
    >
      {/* 월 네비 */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="text-white/50 hover:text-white p-1 transition-colors">
          <svg width="8" height="13" viewBox="0 0 8 13" fill="none">
            <path d="M6.5 1.5L1.5 6.5l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="text-white text-sm font-semibold">{viewYear}년 {viewMonth + 1}월</span>
        <button onClick={nextMonth} className="text-white/50 hover:text-white p-1 transition-colors">
          <svg width="8" height="13" viewBox="0 0 8 13" fill="none">
            <path d="M1.5 1.5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 text-center mb-1">
        {DAYS_KR.map(d => <div key={d} className="text-white/25 text-xs py-1">{d}</div>)}
      </div>

      {/* 날짜 그리드 */}
      {rows.map((row, ri) => (
        <div key={ri} className="grid grid-cols-7">
          {row.map((cell, ci) => {
            const sel = isSel(cell.day, cell.type);
            const tod = isToday(cell.day, cell.type);
            return (
              <div key={ci} className="flex items-center justify-center py-0.5">
                <button
                  onClick={() => cell.type === "current" && handleSelect(cell.day)}
                  disabled={cell.type !== "current"}
                  className={[
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs transition-colors",
                    cell.type !== "current" ? "text-white/15 cursor-default" : "",
                    cell.type === "current" && !sel && !tod ? "text-white/70 hover:bg-white/10" : "",
                    sel ? "bg-brand-green-400 text-white font-medium" : "",
                    tod && !sel ? "border border-white/40 text-white" : "",
                  ].filter(Boolean).join(" ")}
                >
                  {cell.day}
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

const SUGGESTED_MATERIALS = ["교과서", "학습지", "문제집"];

// 자료 유형 태그 입력 
function MaterialTagInput({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  const [input, setInput] = useState("");

  const toggle = (m: string) => {
    if (tags.includes(m)) onChange(tags.filter(t => t !== m));
    else onChange([...tags, m]);
  };

  const addCustom = () => {
    const val = input.trim();
    if (!val || tags.includes(val)) { setInput(""); return; }
    onChange([...tags, val]);
    setInput("");
  };

  const customTags = tags.filter(t => !SUGGESTED_MATERIALS.includes(t));

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {/* 추천 chip */}
      {SUGGESTED_MATERIALS.map(m => {
        const active = tags.includes(m);
        return (
          <button
            key={m}
            type="button"
            onClick={() => toggle(m)}
            className="text-xs px-2.5 rounded-full transition-all"
            style={{
              height: "26px",
              border: active ? "1px solid rgba(102,187,106,0.5)" : "1px solid rgba(255,255,255,0.12)",
              color: active ? "var(--color-brand-green-400)" : "rgba(255,255,255,0.3)",
              background: active ? "rgba(102,187,106,0.1)" : "transparent",
            }}
          >
            {m}
          </button>
        );
      })}

      {/* 직접 입력한 커스텀 태그 */}
      {customTags.map(tag => (
        <span
          key={tag}
          className="flex items-center gap-1 text-xs px-2.5 rounded-full"
          style={{
            height: "26px",
            border: "1px solid rgba(102,187,106,0.5)",
            color: "var(--color-brand-green-400)",
            background: "rgba(102,187,106,0.1)",
          }}
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(tags.filter(t => t !== tag))}
            className="opacity-60 hover:opacity-100 transition-opacity leading-none"
          >
            ×
          </button>
        </span>
      ))}

      {/* 직접 입력 — pill 스타일 */}
      <div
        className="flex items-center px-2.5 rounded-full"
        style={{
          height: "26px",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.nativeEvent.isComposing) return;
            if (e.key === "Enter") { e.preventDefault(); addCustom(); }
          }}
          placeholder="직접 입력..."
          className="bg-transparent text-xs text-white/50 placeholder:text-white/25 outline-none"
          style={{ width: input.length > 0 ? `${input.length * 9 + 16}px` : "64px" }}
        />
        {input.trim() && (
          <button type="button" onClick={addCustom} className="text-white/40 hover:text-white/70 transition-colors text-sm leading-none ml-0.5">+</button>
        )}
      </div>
    </div>
  );
}

// 메인 폼 
export default function ExamRangeForm() {
  const [subjects, setSubjects] = useState<Subject[]>(DEFAULT_SUBJECTS);
  const [inputWidths, setInputWidths] = useState<Record<number, number>>({ 0: getNameWidth("") });
  const [maxReached, setMaxReached] = useState(false);
  const [duplicateError, setDuplicateError] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [isPressingUI, setIsPressingUI] = useState(false);
  const [focusedNameId, setFocusedNameId] = useState<number | null>(null);
  const [openPickerId, setOpenPickerId] = useState<number | null>(null);

  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);
  const nameRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const prevNames = useRef<Record<number, string>>({ 0: "" });

  const handleNameBlur = (index: number) => {
    const id = subjects[index].id;
    const value = nameRefs.current[id]?.value.trim();
    if (value === undefined) return;
    const newName = value || prevNames.current[id];
    const isDup = subjects.some((s, i) => i !== index && s.name === newName && newName !== "");
    if (isDup) {
      setDuplicateError(true);
      if (nameRefs.current[id]) nameRefs.current[id]!.value = prevNames.current[id];
      setInputWidths(prev => ({ ...prev, [id]: getNameWidth(prevNames.current[id]) }));
      return;
    }
    setDuplicateError(false);
    prevNames.current[id] = newName;
    setSubjects(prev => prev.map((s, i) => i === index ? { ...s, name: newName, nameEdited: true } : s));
    if (nameRefs.current[id]) nameRefs.current[id]!.value = newName;
    setInputWidths(prev => ({ ...prev, [id]: getNameWidth(newName) }));
    setFocusedNameId(null);
  };

  const handleLongPressStart = (index: number) => {
    isLongPress.current = false;
    setIsPressingUI(true);
    const id = subjects[index].id;
    setFocusedNameId(null);
    nameRefs.current[id]?.blur();

    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      setRemovingId(id);
      setTimeout(() => {
        delete nameRefs.current[id];
        delete prevNames.current[id];
        setSubjects(prev => prev.filter((_, i) => i !== index));
        setInputWidths(prev => { const n = { ...prev }; delete n[id]; return n; });
        setRemovingId(null);
        setMaxReached(false);
        setDuplicateError(false);
      }, 200);
    }, 500);
  };

  const handleLongPressEnd = () => {
    setIsPressingUI(false);
    if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
  };

  const handleAdd = () => {
    if (subjects.length >= MAX_SUBJECTS) { setMaxReached(true); return; }
    const newId = subjectIdCounter++;
    setMaxReached(false);
    setDuplicateError(false);
    prevNames.current[newId] = "";
    setInputWidths(prev => ({ ...prev, [newId]: getNameWidth("") }));
    setSubjects(prev => [...prev, { id: newId, name: "", startPage: "", endPage: "", date: "", difficulty: "중", materials: [], nameEdited: false }]);
  };

  const update = (index: number, field: Partial<Subject>) =>
    setSubjects(prev => prev.map((s, i) => i === index ? { ...s, ...field } : s));

  const handlePickerClose = useCallback(() => setOpenPickerId(null), []);

  return (
    <div className="flex flex-col flex-1 min-h-0 rounded-2xl overflow-hidden" style={{ background: "#2d2d2d" }}>
      <p className="text-white/30 text-xs px-6 pt-5 shrink-0">과목명을 길게 누르면 삭제됩니다.</p>

      <div className="flex-1 overflow-y-auto px-6">
        {subjects.map((subject, index) => (
          <div
            key={subject.id}
            className="flex flex-col gap-2.5 py-4 border-b border-white/5 last:border-0 transition-opacity duration-200"
            style={{ opacity: removingId === subject.id ? 0 : 1 }}
          >
          <div className="flex items-center gap-3">
            {/* 과목명 — 동적 너비, 꾹 누르면 삭제 */}
            <input
              ref={el => { nameRefs.current[subject.id] = el; }}
              defaultValue={subject.name}
              placeholder="과목명"
              maxLength={MAX_NAME_LENGTH}
              onChange={e => setInputWidths(prev => ({ ...prev, [subject.id]: getNameWidth(e.target.value) }))}
              onBlur={() => handleNameBlur(index)}
              onFocus={e => {
                if (isLongPress.current) { e.target.blur(); return; }
                setFocusedNameId(subject.id);
              }}
              onPointerDown={e => { e.stopPropagation(); handleLongPressStart(index); }}
              onPointerUp={handleLongPressEnd}
              onPointerLeave={handleLongPressEnd}
              className={`text-sm text-center focus:outline-none bg-transparent placeholder:text-white/30 shrink-0 transition-all ${subject.nameEdited ? "text-white" : "text-white/55"}`}
              style={{
                ...(focusedNameId === subject.id ? INPUT_FOCUS : INPUT_BASE),
                width: `${inputWidths[subject.id] ?? 100}px`,
                cursor: isPressingUI ? "default" : focusedNameId === subject.id ? "text" : "default",
              }}
            />

            {/* 시작 페이지 */}
            <div className="flex items-center gap-0.5 px-3 shrink-0" style={INPUT_BASE}>
              <input
                type="text" inputMode="numeric"
                value={subject.startPage}
                onChange={e => update(index, { startPage: e.target.value.replace(/\D/g, "") })}
                placeholder="p"
                className="bg-transparent outline-none w-8 text-center text-white/80 placeholder:text-white/30 text-sm"
              />
              {subject.startPage && <span className="text-white/30 text-xs">p</span>}
            </div>

            <span className="text-white/40 text-sm shrink-0">~</span>

            {/* 끝 페이지 */}
            <div className="flex items-center gap-0.5 px-3 shrink-0" style={INPUT_BASE}>
              <input
                type="text" inputMode="numeric"
                value={subject.endPage}
                onChange={e => update(index, { endPage: e.target.value.replace(/\D/g, "") })}
                placeholder="p"
                className="bg-transparent outline-none w-8 text-center text-white/80 placeholder:text-white/30 text-sm"
              />
              {subject.endPage && <span className="text-white/30 text-xs">p</span>}
            </div>

            {/* 날짜 + 피커 */}
            <div className="relative shrink-0">
              <div className="flex items-center gap-2 px-3" style={INPUT_BASE}>
                <input
                  type="text"
                  value={subject.date}
                  onChange={e => update(index, { date: e.target.value })}
                  placeholder="YYYY.MM.DD"
                  maxLength={10}
                  className="bg-transparent outline-none w-24 text-white/80 placeholder:text-white/30 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setOpenPickerId(openPickerId === subject.id ? null : subject.id)}
                  className="shrink-0 opacity-40 hover:opacity-80 transition-opacity"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="1" y="1.5" width="12" height="11" rx="2" stroke="white" strokeWidth="1.1" />
                    <path d="M1 5.5h12" stroke="white" strokeWidth="1.1" />
                    <path d="M4.5 0.5v2M9.5 0.5v2" stroke="white" strokeWidth="1.1" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              {openPickerId === subject.id && (
                <DatePicker
                  value={subject.date}
                  onChange={date => update(index, { date })}
                  onClose={handlePickerClose}
                />
              )}
            </div>

            {/* 난이도 */}
            <div className="relative shrink-0">
              <select
                value={subject.difficulty}
                onChange={e => update(index, { difficulty: e.target.value as Difficulty })}
                className="text-white/70 text-sm focus:outline-none appearance-none pr-7 pl-3"
                style={{ ...INPUT_BASE, width: "72px", backgroundColor: "transparent" }}
              >
                {DIFFICULTIES.map(d => (
                  <option key={d} value={d} style={{ backgroundColor: "#2a2a2a" }}>{d}</option>
                ))}
              </select>
              <Image
                src="/images/icon/school-toggle.svg"
                alt="열기" width={16} height={16}
                className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
              />
            </div>
          </div>

            {/* 자료 유형 태그 입력 */}
            <MaterialTagInput
              tags={subject.materials}
              onChange={tags => update(index, { materials: tags })}
            />
          </div>
        ))}
      </div>

      {/* 추가 버튼 + 에러 */}
      <div className="border-t border-white/10 px-6 py-4 flex flex-col gap-2 shrink-0">
        {maxReached && <ErrorMessage message="과목 추가는 최대 9개까지 가능합니다." />}
        {duplicateError && <ErrorMessage message="이미 존재하는 과목명입니다." />}
        <button
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-2 text-white/40 text-sm hover:text-white/70 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M9 5.5v7M5.5 9h7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          과목 추가하기
        </button>
      </div>
    </div>
  );
}
