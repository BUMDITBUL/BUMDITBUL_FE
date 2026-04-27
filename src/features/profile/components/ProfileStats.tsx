const COMPLETED = 32;
const TOTAL = 48;
const RATE = Math.round((COMPLETED / TOTAL) * 100);

export default function ProfileStats() {
  return (
    <div className="grid grid-cols-3 gap-3 shrink-0">
      {/* D-day */}
      <div className="flex flex-col gap-1.5 rounded-2xl p-5" style={{ background: "#2d2d2d" }}>
        <span className="text-white/50 text-xs">시험까지</span>
        <span className="text-2xl font-bold" style={{ color: "var(--color-brand-green-400)" }}>D-14</span>
      </div>

      {/* 달성률 */}
      <div className="flex flex-col gap-2 rounded-2xl p-5" style={{ background: "#2d2d2d" }}>
        <div className="flex items-end justify-between">
          <span className="text-white/50 text-xs">달성률</span>
          <span className="text-white/40 text-xs">{COMPLETED}/{TOTAL}</span>
        </div>
        <span className="text-2xl font-bold text-white">{RATE}%</span>
        <div className="w-full rounded-full overflow-hidden" style={{ height: "4px", background: "rgba(255,255,255,0.1)" }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${RATE}%`, background: "var(--color-brand-green-400)" }}
          />
        </div>
      </div>

      {/* 연속 학습 */}
      <div className="flex flex-col gap-1.5 rounded-2xl p-5" style={{ background: "#2d2d2d" }}>
        <span className="text-white/50 text-xs">연속 학습</span>
        <span className="text-2xl font-bold text-white">5일</span>
      </div>
    </div>
  );
}
