export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col bg-brand-black-900">
      {/* 네비게이션 */}
      <nav className="flex items-center justify-between px-10 py-3 shrink-0 border-b border-white/10">
        <img src="/images/logo.svg" alt="범딧불" className="w-8 h-8" />
      </nav>

      {/* 콘텐츠 */}
      <div className="flex flex-1 items-center justify-center p-10 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}