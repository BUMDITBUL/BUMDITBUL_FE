import Image from "next/image";

export default function AuthNav() {
  return (
    <nav className="flex items-center justify-between px-10 py-3 shrink-0 border-b border-white/10">
      <Image src="/images/logo.svg" alt="범딧불" width={32} height={32} />
      <a href="/login" className="underline text-brand-green-400" style={{ fontSize: "15px", fontWeight: 500 }}>
        로그인
      </a>
    </nav>
  );
}
