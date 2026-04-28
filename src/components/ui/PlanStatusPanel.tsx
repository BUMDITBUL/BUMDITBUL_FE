interface PlanStatusPanelProps {
  status: "generating" | "error";
  userName?: string;
}

export default function PlanStatusPanel({ status, userName = "사용자" }: PlanStatusPanelProps) {
  return (
    <div
      className="flex-1 min-h-0 rounded-2xl flex flex-col items-center justify-center gap-4"
      style={{ background: "var(--color-surface)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      {status === "generating" ? (
        <>
          <p className="text-white/70 text-sm">{userName}님의 일정을 생성 중이에요.</p>
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-white/40"
                style={{ animation: `blink 1.2s ease-in-out ${i * 0.2}s infinite` }}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="text-white/70 text-sm">생성도중에 문제가 발생했어요.</p>
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
            <circle cx="17" cy="17" r="15" stroke="rgba(211,84,0,0.75)" strokeWidth="1.5" />
            <path d="M17 11v8" stroke="rgba(211,84,0,0.75)" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="17" cy="23" r="1.1" fill="rgba(211,84,0,0.75)" />
          </svg>
        </>
      )}

      <style>{`
        @keyframes blink {
          0%, 80%, 100% { opacity: 0.3; }
          40% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
