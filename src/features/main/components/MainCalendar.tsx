"use client";

import { useState } from "react";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function MainCalendar() {
  const today = new Date();
  const todayY = today.getFullYear();
  const todayM = today.getMonth();
  const todayD = today.getDate();

  const [viewYear, setViewYear] = useState(todayY);
  const [viewMonth, setViewMonth] = useState(todayM);
  const [selectedDay, setSelectedDay] = useState(new Date(todayY, todayM, todayD));

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const daysInPrevMonth = getDaysInMonth(viewYear, viewMonth - 1);

  const cells: { day: number; type: "prev" | "current" | "next" }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, type: "prev" });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, type: "current" });
  }
  const rem = cells.length % 7;
  if (rem !== 0) {
    for (let d = 1; d <= 7 - rem; d++) {
      cells.push({ day: d, type: "next" });
    }
  }

  const rows: (typeof cells)[] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const isToday = (day: number, type: string) =>
    type === "current" && day === todayD && viewYear === todayY && viewMonth === todayM;

  const isSelected = (day: number, type: string) =>
    type === "current" && day === selectedDay.getDate() && viewYear === selectedDay.getFullYear() && viewMonth === selectedDay.getMonth();

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-3">
      {/* 월 네비게이션 */}
      <div className="flex items-center justify-center gap-6 shrink-0">
        <button onClick={prevMonth} className="text-white/60 hover:text-white transition-colors p-1">
          <svg width="9" height="15" viewBox="0 0 9 15" fill="none">
            <path d="M7.5 1.5L2 7.5l5.5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="text-white font-semibold text-base" style={{ minWidth: "90px", textAlign: "center" }}>
          {viewYear} {viewMonth + 1}월
        </span>
        <button onClick={nextMonth} className="text-white/60 hover:text-white transition-colors p-1">
          <svg width="9" height="15" viewBox="0 0 9 15" fill="none">
            <path d="M1.5 1.5L7 7.5l-5.5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 text-center shrink-0">
        {DAYS.map(d => (
          <div key={d} className="text-brand-black-500 text-sm py-1">{d}</div>
        ))}
      </div>

      {/* 날짜 그리드 — 행이 남은 공간을 균등 분할 */}
      <div
        className="flex-1 min-h-0"
        style={{ display: "grid", gridTemplateRows: `repeat(${rows.length}, 1fr)` }}
      >
        {rows.map((row, ri) => (
          <div key={ri} className="grid grid-cols-7 items-center">
            {row.map((cell, ci) => {
              const today_ = isToday(cell.day, cell.type);
              const selected = isSelected(cell.day, cell.type);
              return (
                <div key={ci} className="flex items-center justify-center">
                  <button
                    onClick={() => cell.type === "current" && setSelectedDay(new Date(viewYear, viewMonth, cell.day))}
                    disabled={cell.type !== "current"}
                    className={[
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm transition-colors",
                      cell.type !== "current" ? "text-brand-black-700 cursor-default" : "",
                      cell.type === "current" && !selected && !today_ ? "text-white hover:bg-white/10" : "",
                      selected ? "bg-brand-green-400 text-white font-medium" : "",
                      today_ && !selected ? "border border-white text-white" : "",
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
    </div>
  );
}
