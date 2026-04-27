import Link from "next/link";

export default function SchedulePanel() {
  return (
    <div className="flex-1 min-w-0">
      <div
        className="flex flex-col items-center justify-center gap-5 rounded-2xl p-10"
        style={{ background: "#2d2d2d" }}
      >
        <p className="text-white/60 text-sm">
          아직 예정된 학습이 없어요. 한번 생성해볼까요?
        </p>
        <Link
          href="/profile/exam-range"
          className="text-white text-sm font-medium hover:opacity-90 transition-opacity bg-brand-green-400 px-8 flex items-center justify-center"
          style={{ height: "46px", borderRadius: "14px" }}
        >
          일정 생성하기
        </Link>
      </div>
    </div>
  );
}
