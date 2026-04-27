"use client";

import { useState } from "react";
import Image from "next/image";

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

export default function StudyPanel() {
  const [items, setItems] = useState(initialItems);

  const toggleSub = (itemId: number, subId: number) => {
    setItems(prev => prev.map(item =>
      item.id !== itemId ? item : {
        ...item,
        subItems: item.subItems.map(s => s.id === subId ? { ...s, checked: !s.checked } : s),
      }
    ));
  };

  const toggleAll = (itemId: number) => {
    setItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      const allDone = item.subItems.every(s => s.checked);
      return { ...item, subItems: item.subItems.map(s => ({ ...s, checked: !allDone })) };
    }));
  };

  return (
    <div
      className="flex flex-col gap-4 rounded-2xl p-6 shrink-0 h-full"
      style={{ width: "360px", background: "#2d2d2d" }}
    >
      <h2 className="text-white font-semibold text-base">오늘 할 공부</h2>

      <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
        {items.map(item => {
          const allDone = item.subItems.every(s => s.checked);
          return (
            <div
              key={item.id}
              className="flex flex-col rounded-xl px-4 py-3 gap-2.5"
              style={{ background: "#3a3a3a" }}
            >
              {/* 과목 헤더 — 오른쪽 큰 체크 */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">
                  {item.subject}
                </span>
                <button onClick={() => toggleAll(item.id)} className="shrink-0 p-1">
                  <Image
                    src={allDone ? "/images/icon/check_active.svg" : "/images/icon/check_default.svg"}
                    alt={allDone ? "완료" : "미완료"}
                    width={20}
                    height={20}
                  />
                </button>
              </div>

              {/* 세부 항목 — 작은 원 + 연속 취소선 */}
              <div className="flex flex-col gap-1.5 pl-0.5">
                {item.subItems.map(sub => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => toggleSub(item.id, sub.id)}
                    className="flex items-center gap-2 text-left"
                  >
                    {/* 작은 원형 체크 */}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                      {sub.checked ? (
                        <>
                          <circle cx="7" cy="7" r="6.5" fill="var(--color-brand-green-400)" />
                          <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </>
                      ) : (
                        <circle cx="7" cy="7" r="6.5" stroke="rgba(255,255,255,0.25)" />
                      )}
                    </svg>
                    {/* 자료명 + 페이지 한 span — 취소선 끊김 없음 */}
                    <span className={`text-xs leading-none ${sub.checked ? "line-through text-white/30" : "text-white/55"}`}>
                      {sub.material} {sub.pages}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button className="hover:opacity-70 transition-opacity">
          <Image src="/images/icon/plus.svg" alt="추가" width={24} height={24} />
        </button>
      </div>
    </div>
  );
}
