export default function AuthNav() {
  return (
    <nav className="flex items-center justify-between px-10 py-3 shrink-0 border-b border-white/10">
      <img src="/images/logo.svg" alt="범딧불" className="w-8 h-8" />
      <a href="/login" className="underline text-brand-green-600" style={{ fontSize: "15px", fontWeight: 500 }}>
        로그인
      </a>
    </nav>
  );
}