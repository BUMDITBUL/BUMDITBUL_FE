import AuthNav from "@/components/common/AuthNav";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full flex flex-col bg-brand-black-900">
      <AuthNav />

      <div className="flex flex-1 overflow-hidden">

        {/* 좌측: 배경 이미지 + 슬로건 */}
        <div className="relative w-1/2 overflow-hidden">
          <img
            src="/images/auth-bg.jpg"
            alt="background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-start pl-25">
            <h1
              style={{
                fontFamily: "Inter",
                fontWeight: 800,
                fontSize: "48px",
                lineHeight: 1.15,
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
              }}
            >
              <span className="text-white">시험기간 일정을</span>
              <br />
              <span className="text-white">누구보다 </span>
              <span className="text-brand-green-200">빠르고,</span>
              <br />
              <span className="text-brand-green-200">효율적</span>
              <span className="text-white">으로!</span>
            </h1>
          </div>
        </div>

        {/* 우측: 폼 카드 */}
        <div className="w-1/2 flex items-center justify-center px-20 bg-brand-black-900">
          <div className="w-full max-w-[480px]">
            {children}
          </div>
        </div>

      </div>
    </div>
  );
}