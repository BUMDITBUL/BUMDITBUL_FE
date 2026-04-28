import Image from "next/image";

export default function OnboardingStep3Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full flex flex-col bg-brand-black-900 overflow-hidden">
      <nav className="flex items-center px-10 py-3 shrink-0 border-b border-white/10">
        <Image src="/images/logo.svg" alt="범딧불" width={32} height={32} />
      </nav>
      <div className="flex-1 min-h-0 flex justify-center overflow-hidden">
        {children}
      </div>
    </div>
  );
}
