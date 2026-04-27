import Image from "next/image";

export default function HeroBanner() {
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
