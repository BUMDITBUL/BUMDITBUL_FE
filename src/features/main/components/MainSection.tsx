"use client";

import { useState } from "react";
import MainCalendar from "./MainCalendar";
import StudyPanel from "./StudyPanel";

export default function MainSection() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate());
  });

  return (
    <div className="flex gap-6 flex-1 min-h-0">
      <MainCalendar selectedDay={selectedDate} onDaySelect={setSelectedDate} />
      <StudyPanel selectedDate={selectedDate} />
    </div>
  );
}
