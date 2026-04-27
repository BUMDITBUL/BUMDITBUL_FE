import Image from "next/image";
import Link from "next/link";

export default function ExamNav() {
  return (
    <nav className="flex items-center justify-between px-10 py-3 shrink-0 border-b border-white/10">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/images/logo.svg" alt="범딧불" width={32} height={32} />
        <span className="text-white font-semibold text-base">범딧불</span>
      </Link>
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-brand-green-500 flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.33 0-10 1.674-10 5v2h20v-2c0-3.326-6.67-5-10-5z" />
          </svg>
        </div>
        <span className="text-white text-sm font-medium">정지윤</span>
        <span className="text-white/30 text-sm">•</span>
        <span className="text-brand-black-500 text-sm">대덕소프트웨어마이스터고등학교</span>
      </div>
    </nav>
  );
}
