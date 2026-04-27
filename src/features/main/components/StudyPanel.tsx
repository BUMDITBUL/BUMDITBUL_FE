"use client";

import { useState } from "react";
import Image from "next/image";

const initialItems = [
  { id: 1, subject: "수학", timeRange: "19:25 ~ 20:55", pages: "96 ~ 106p", checked: true },
  { id: 2, subject: "영어", timeRange: "21:05 ~ 22:40", pages: "81 ~ 85p", checked: false },
  { id: 3, subject: "과학", timeRange: "22:30 ~ 24:00", pages: "95 ~ 106p", checked: false },
];

export default function StudyPanel() {
  const [items, setItems] = useState(initialItems);

  const toggle = (id: number) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  return (
    <div
      className="flex flex-col gap-4 rounded-2xl p-6 shrink-0 h-full"
      style={{ width: "360px", background: "#2d2d2d" }}
    >
      <h2 className="text-white font-semibold text-base">오늘 할 공부</h2>

      <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
        {items.map(item => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ background: "#3a3a3a" }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-medium">{item.subject}</span>
                <span className="text-brand-black-500 text-xs">{item.timeRange}</span>
              </div>
              <span className="text-brand-black-500 text-xs">{item.pages}</span>
            </div>
            <button onClick={() => toggle(item.id)} className="shrink-0 p-1">
              <Image
                src={item.checked ? "/images/icon/check_active.svg" : "/images/icon/check_default.svg"}
                alt={item.checked ? "완료" : "미완료"}
                width={18}
                height={18}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button className="hover:opacity-70 transition-opacity">
          <Image src="/images/icon/plus.svg" alt="추가" width={24} height={24} />
        </button>
      </div>
    </div>
  );
}
