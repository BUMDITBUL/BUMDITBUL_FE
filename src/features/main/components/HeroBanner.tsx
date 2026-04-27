import Image from "next/image";

function getDdayLabel() {
  const today = new Date();
  const exam = new Date(2026, 4, 11);
  const diff = Math.ceil((exam.getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) / 86400000);
  return diff > 0 ? `D-${diff}` : diff === 0 ? "D-Day" : `D+${Math.abs(diff)}`;
}

export default function HeroBanner() {
  const ddayLabel = getDdayLabel();
  return (
    <div className="relative overflow-hidden shrink-0" style={{ height: "35vh" }}>
      <Image
        src="/images/exam.jpg"
        alt=""
        aria-hidden="true"
        fill
        sizes="(max-width: 1280px) 100vw, 1280px"
        priority
        className="object-cover"
        style={{ objectPosition: "50% 20%" }}
      />
      <div className="absolute inset-0 bg-black/25" />
      {/* D-day 카드 */}
      <div
        className="absolute top-6 right-10 flex flex-col items-center gap-1 px-6 py-4 rounded-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 60%, rgba(255,255,255,0.08) 100%)",
          backdropFilter: "blur(2px)",
          border: "1px solid rgba(255,255,255,0.35)",
          boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.2)",
        }}
      >
        <span className="text-white/70 text-xs font-medium tracking-wide">시험까지</span>
        <span className="text-white font-bold" style={{ fontSize: "36px", lineHeight: 1 }}>{ddayLabel}</span>
      </div>

      <div className="absolute bottom-8 left-10 flex flex-col gap-3">
        <h2
          style={{
            fontFamily: "Inter",
            fontWeight: 800,
            fontSize: "34px",
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            textShadow: "0 2px 12px rgba(0,0,0,0.3)",
          }}
        >
          <span className="text-white">무엇을 할지 고민하는 시간,</span>
          <br />
          <span className="text-white">이제는 </span>
          <span className="text-brand-green-100">공부에만</span>
          <span className="text-white"> 쓰세요</span>
        </h2>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 rounded-full bg-white" style={{ width: "16px" }} />
          <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
        </div>
      </div>
    </div>
  );
}
